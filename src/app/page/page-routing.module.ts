import { RouterModule, Routes } from '@angular/router';

import { CurbViewComponent } from './curb-view/curb-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'curb-view',
        component: CurbViewComponent,
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
