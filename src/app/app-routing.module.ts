import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from './layouts/app-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PageModule } from './page/page.module';

const routes: Routes = [
  {
    path: '',
    // component: AppLayoutComponent,
    // canActivateChild: [AuthGuard],

    children: [
      {
        path: 'app',
        component: AppLayoutComponent,
        // canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./page/page.module').then((m) => m.PageModule),
          },
          {
            path: '**',
            redirectTo: '/app/dashboard',
          },
        ],
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        redirectTo: '/app/dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/app/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
