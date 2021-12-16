import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from './../../services/authentication.service';
import { ValidationService } from './../../helpers/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: any;
  loading = false;
  returnUrl: string = "";
  loginForm: FormGroup;

  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
    // this._router.navigate([this.returnUrl]);

    // this._script.loadScripts('body', [
    //     'assets/vendors/base/vendors.bundle.js',
    //     // 'assets/demo/default/base/scripts.bundle.js'
    //     ], true).then(() => {
    //         Helpers.setLoading(false);
    //         LoginCustom.init();
    //     });

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, ValidationService.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  signIn() {
    console.log(this.loginForm);
    if (this.loginForm.dirty && this.loginForm.valid) {
      //this._authService.login(this.model.email, this.model.password)
      //this._router.navigate([this.returnUrl]);
      this._authService.onLogin(this.loginForm.value).subscribe(
        response => {
          // get return url from route parameters or default to '/'
          console.log("Logged in successfully");
          this._router.navigate([this.returnUrl]);
          this.loginForm.reset();
        },
        error => {
          this.error = error.error;
          console.log("Invalid mobile or password ");
        }
      );
      // Clear form fields
    }
  }

}
