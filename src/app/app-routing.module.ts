import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full',
  },
  {
    path: 'dashboard', 
    //component: DashboardComponent, 
    loadChildren: () => import('./components/dashboard/dashboard.module').then(dashboard => dashboard.DashboardModule),
    canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo:'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
