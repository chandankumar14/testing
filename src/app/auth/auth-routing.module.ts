import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from '../layouts/app-layout.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // component: AppLayoutComponent,
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
    //   {
    //     path: 'register',
    //     component: RegisterComponent
    //   },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: '**',
        redirectTo: '/login'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/app/dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule { }