import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegistrationComponent } from './core/auth/components/registration/registration.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RestorePasswordComponent } from './pages/restore-password-email/restore-password.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full',
  },
  {
    path: 'dashboard', 
    //component: DashboardComponent, 
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(dashboard => dashboard.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'registration',
    component: RegistrationComponent
  },
  {
    path: 'restore-password',
    component: RestorePasswordComponent
  },
  {
    path: '**', 
    redirectTo:'login', 
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
