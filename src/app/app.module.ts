import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/auth/components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { BodyComponent } from './layout/body/body.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule , SPINNER} from 'ngx-ui-loader';
import { RegistrationComponent } from './core/auth/components/registration/registration.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text:'Cargando...',
  textColor: '#0e073e',
  textPosition: 'center-center',
  bgsColor: '#7b1fa2',
  fgsColor: '#7b1fa2',
  fgsType: SPINNER.circle,
  fgsSize: 100,
  hasProgressBar: false,
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [
   DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
