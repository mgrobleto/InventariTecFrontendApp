import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentService } from 'src/environments/environment.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn = false;

  apiURL;

  constructor(private http: HttpClient, private envService: EnvironmentService) {
    this.apiURL = this.envService.apiUrl
  }

  //private authToken: string | null = null;
  private userData : any = [];
  
  setAuthToken(token: string) {
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  getAuthToken() : string | null {
    return localStorage.getItem('token');
  }

  clearAuthToken() : void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }

  login(userCredentials : any) : Observable<any> {
    return this.http.post(this.apiURL + '/user/login/', userCredentials)
  }

  logout() : Observable<any> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Token ${token}`) : new HttpHeaders();
    console.log('header que le paso para que cierre sesion ' + headers.get('Authorization'));

    this.clearAuthToken();
    return this.http.post(this.apiURL + '/user/logout/', '', {headers}) 
  }

  getData(url: string) : Observable<any> {
    return this.http.get(url);
  }

  postData(url: string, data: any) : Observable<any> {
    return this.http.post(url, data);
  }

  setUserInfo(userData: any) {
    this.userData = userData;
  }

  getUserInfo() {
    return this.userData;
  }

  /*clearAuthInfo() {
    this.authToken = null;
    localStorage.removeItem('Token');
    sessionStorage.removeItem('currentUser');
    //this.userData = [];
    //delete this.http.defaults.headers.common['Authorization']
  }*/
}
