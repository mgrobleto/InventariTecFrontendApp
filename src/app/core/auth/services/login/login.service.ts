import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient, HttpBackend} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})

export class LoginService {

  loggedIn = false;
  apiURL = environment.apiUrl;

  constructor(
    private http: HttpClient, 
    handler: HttpBackend ,
    private authService : AuthService, 
    public router: Router
  ) {
    this.http = new HttpClient(handler);
  }

  /*login(username: string, password: string) {
    const userCredentials = {username, password};
    this.authService.login(userCredentials).subscribe((response : any) => {
      const token = response.token;
      this.authService.setAuthToken(token)
      this.authService.setUserInfo(response.user)
      window.localStorage.setItem('currentUser', JSON.stringify(response.user));
      console.log('Logged in successfully')
      console.log(response)
      this.loggedIn = true;
    }, (error) => {
      console.log(error);
      this.loggedIn = false;
    })
  } */


  login(username: string, password: string)  {
    const userCredentials = {username, password};

    return this.authService.login(userCredentials).pipe(
      map(
        user => {
          if (user && user.token) {
            let token = user.token;
            this.authService.setAuthToken(token)
            this.authService.setUserInfo(user)
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('TOKEN DEL NUEVO USUARIO: ' + token)
            console.log('Logged in successfully')
            console.log('Info user' + user)
          }

          return user;
        }
      )
    )
  }

  logOut() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('currentUser');
      console.log(localStorage.getItem('currentUser'))
      console.log('Logged out successfully');
      this.router.navigate(['/login']);
    }, (error) => {
      console.log('Log out failed!' + error);
    })
  } 
}
