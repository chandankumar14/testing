import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppLayoutComponent } from './../layouts/app-layout.component';
import { ChartModule } from 'angular-highcharts';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './../layouts/footer/footer.component';
import { HeaderComponent } from './../layouts/header/header.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MapComponent } from './map/map.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppLayoutComponent,
    FooterComponent,
    HeaderComponent,
    MapComponent,
    LineChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule,
    ChartModule,
    AppLayoutComponent,
    FooterComponent,
    HeaderComponent,
    MapComponent,
    LineChartComponent,
  ],
})
export class SharedModule {}
