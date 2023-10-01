import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';

@NgModule({
  declarations: [
    HeaderComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
