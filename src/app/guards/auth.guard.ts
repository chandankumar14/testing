import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "./../services/authentication.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this._authService.isAuthenticated()) {
      // logged in so return true
      console.log("AUTHENTICATEDDD");
      return true;
    }
    // error when verify so redirect to login page with the return url
    this._router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import("@angular/router").UrlTree
    | Observable<boolean | import("@angular/router").UrlTree>
    | Promise<boolean | import("@angular/router").UrlTree> {
        console.log("CHECKING")
    if (this._authService.isAuthenticated()) {
      // logged in so return true
      return true;
    }
    // error when verify so redirect to login page with the return url
    this._router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    // this._router.navigate(["/auth/login"]);
    return false;
  }
}