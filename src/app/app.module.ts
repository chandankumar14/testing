import { AppComponent } from './app.component';
import { AppHttpInterceptorService } from './services/http-interceptor.service';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './services/authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './layouts/footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './layouts/header/header.component';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,   
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule    
  ],
  providers: [
    AuthenticationService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
