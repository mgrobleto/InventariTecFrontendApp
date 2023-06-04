import { HttpClient, HttpEvent } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, tap, delay} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //api_url : string = 'http://localhost:8000/';
  api_url = environment.apiUrl;
  isLoggedIn = false;

  constructor(private http : HttpClient) {}

  login (username : string, password : string) : Observable<boolean> {
    return this.http.post<any>(this.api_url + `accounts/api/auth/`, {username, password}, httpOptions).pipe(
      map (user => {
        if (user && user.token){
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log("Ha iniciado sesion");
          this.isLoggedIn = true;
          console.log(this.isLoggedIn)
        }else{
          this.isLoggedIn = false;
        }
        //this.isLoggedIn();
        return user.token;
      })
    );
  }

  // isLoggedIn(){
  //   const token = localStorage.getItem('token');
  //   console.log(token);
  //   if(token === null) return false;
  //   else return true;
  // }

  logout() : void { 
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
  }
}
