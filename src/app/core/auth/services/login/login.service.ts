import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient, HttpBackend} from '@angular/common/http';
import { map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

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
    public router: Router,
  ) {
    this.http = new HttpClient(handler);
    /* this.apiURL = this.envService.apiUrl */
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
    this.authService.logout()
      .pipe(
        finalize(() => {
          this.router.navigate(['/login']);
        })
      )
      .subscribe(() => {
        console.log('Logged out successfully');
      }, (error) => {
        console.log('Log out failed!' + error);
      });
  } 
}

