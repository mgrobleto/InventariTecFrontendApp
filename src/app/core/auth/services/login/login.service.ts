import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AuthService } from '../auth.service';
import { CsrfTokenService } from '../csrf-token.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

/* var token = '';

const logOutOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `token ${token}`
  })
} */



@Injectable({
  providedIn: 'root'
})

export class LoginService {

  apiURL = environment.apiUrl;
  isLoggedIn = false;  

  constructor(private http: HttpClient, private authService : AuthService, private csrfService : CsrfTokenService) { }

  login(username: string, password: string) : Observable<boolean> {
    return this.http.post<any>(this.apiURL + '/user/login/', {username, password}, httpOptions).pipe(
      map(
        user => {
          if (user && user.token) {
            this.authService.setAuthToken(user.token);
            this.authService.setUserInfo(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', user.token);
            console.log('Ha iniciado sesionando')
            this.isLoggedIn = true;
          }

          this.isLoggedIn = false;

          return user;
        }
      )
    )
  }

  logOut(auth_token: string | null) : Observable<any> {

    //let csrfToken;

    /* this.getCsrfToken().subscribe(
      (data : any) => {
      const csrf_Token = data.csrf_token;
      csrfToken = csrf_Token;
      console.log(csrfToken);
      }, err => console.log('no se obtuvo el csrf token',err)
    ) */

    this.isLoggedIn = false;

    //const csrfToken = this.csrfService.getCsrfToken();

    //console.log('Obtuve el Token CSRF: ', csrfToken);
    console.log('Obtuve el Token del user: ', auth_token);

    const headersObj = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${auth_token}`,
    }) 

    console.log(headersObj);

    return this.http.post(this.apiURL + '/user/logout/', "", { 'headers': headersObj });
  } 
}
