import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './auth/components/login/login.component';
import { MatchpasswordvalidatorComponent } from './components/matchpasswordvalidator/matchpasswordvalidator.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MatchpasswordvalidatorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CoreModule { }
