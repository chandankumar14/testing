import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

// Setup headers
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
  public currentUser = new BehaviorSubject<any>(null);
  public userEmitter = this.currentUser.asObservable();

  private readonly apiUrl = environment.apiUrl;
  private registerUrl = this.apiUrl + '/auth/register';
  private loginUrl = this.apiUrl + '/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router) { }

  onRegister(user: any): Observable<any> {

    const request = JSON.stringify(
     user
    );

    return this.http.post(this.registerUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          // Receive jwt token in the response
          const token: string = response['access_token'];
          // If we have a token, proceed
          if (token) {
            this.setToken(token);
            this.getUser().subscribe();
          }
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  onLogin(user: any): Observable<any> {

    const request = JSON.stringify(
      { email: user.email, password: user.password }
    );

    return this.http.post(this.loginUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          // Receive jwt token in the response
          const token: string = response['access_token'];
          // If we have a token, proceed
          if (token) {
            this.setToken(token);
            this.getUser().subscribe();
          }
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  onLogout(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/logout', httpOptions).pipe(
      tap(
        () => {
          localStorage.removeItem('token');
          this.userEmitChange(null);
          this.router.navigate(['/']);
        }
      )
    );
  }

  setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): Observable<any> {
    if(!this.getToken()) {
      return of(null);
    }
    return this.http.get(this.apiUrl + '/profile/me').pipe(
      tap(
        (user: any) => {
          // this.currentUser = user;
          this.userEmitChange(user);
        }
      )
    );
  }

  isAuthenticated(): boolean {
    // get the token
    const token: string | null = this.getToken();
    if (token) {
      return true;
    }
    return false;
  }

  private userEmitChange(usr: any) {
    console.log("00000",usr);
    this.currentUser.next(usr);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side error.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend error.
      return throwError(error);
    }
    // return a custom error message
    return throwError('Ohps something wrong happen here; please try again later.');
  }
}