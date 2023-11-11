import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn = false;

  private authToken: string | null = null;
  private userData : any = [];

  setAuthToken(token: string) {
    this.authToken = token;
    this.isLoggedIn = true;
  }

  getAuthToken() {
    return this.authToken;
  }

  setUserInfo(userData: any) {
    this.userData = userData;
  }

  getUserInfo() {
    return this.userData;
  }


 /*  isLoggedIn() {
    const token = localStorage.getItem('token');
   console.log(token);
    if(token === null) return false;
    else return true;
  } */

  /* logout(){ 
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    console.log(this.isLoggedIn);
  } */
}
