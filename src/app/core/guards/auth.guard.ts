import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { LoginService } from '../auth/services/login/login.service';

@Injectable({
 providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // inject the router service to allow navigation.
 constructor(private authService: AuthService, private router: Router, private loginService : LoginService) { }

 canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
  
  if(this.authService.isLoggedIn === true){
    console.log('Usuario autenticado')
    return true;
  }

  this.router.navigate([("/login")]); // si no está autenticado lo regresa al login
  console.log('Usuario no autenticado');

  return false;
 }

}