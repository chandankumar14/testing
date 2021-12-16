import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './page-routing.module';
import { SharedModule } from './../shared/shared.module';
import { CurbViewComponent } from './curb-view/curb-view.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { LayerOneComponent } from './components/layer-one/layer-one.component';
import { LayerTwoComponent } from './components/layer-two/layer-two.component';
import { LayerThreeComponent } from './components/layer-three/layer-three.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CurbViewComponent,
    LayerOneComponent,
    LayerTwoComponent,
    LayerThreeComponent
  ],
  imports: [
    SharedModule,
    PageRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA', // Optional, can also be set per map (accessToken input of mgl-map)
      // geocoderAccessToken: 'TOKEN' // Optional, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ]
})
export class PageModule { }
