import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/auth/components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderConfig, NgxUiLoaderModule , SPINNER} from 'ngx-ui-loader';
import { RegistrationComponent } from './core/auth/components/registration/registration.component';
import { ProductCategoryComponent } from './features/productCategory/product-category.component';
import { AddEditCustomerFormComponent } from './features/customers/add-edit-customer-form/add-edit-customer-form.component';
import { AddEditSuppliersFormComponent } from './features/suppliers/add-edit-suppliers-form/add-edit-suppliers-form/add-edit-suppliers-form.component';
import { TokenInterceptorService } from './data/interceptors/TokenInterceptor.interceptor';

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
    RegistrationComponent,
    ProductCategoryComponent,
    AddEditCustomerFormComponent,
    AddEditSuppliersFormComponent
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
   {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
