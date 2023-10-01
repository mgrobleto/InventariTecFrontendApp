import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

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
    //canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo:'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
