import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn = false;

  apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {
    /* this.apiURL = this.envService.apiUrl */
    // Restore authentication state on service initialization (page reload)
    this.restoreAuthState();
  }

  //private authToken: string | null = null;
  private userData : any = [];
  
  /**
   * Restore authentication state from localStorage on page reload
   */
  private restoreAuthState(): void {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    
    if (token) {
      this.isLoggedIn = true;
      // Restore user data if it exists in localStorage
      if (currentUser) {
        try {
          this.userData = JSON.parse(currentUser);
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          this.userData = [];
        }
      }
    } else {
      this.isLoggedIn = false;
    }
  }
  
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
    localStorage.removeItem('currentUser');
    this.userData = [];
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
