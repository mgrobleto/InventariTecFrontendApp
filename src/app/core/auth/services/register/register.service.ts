import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient : HttpClient) { }

  registerUserWithBusiness(registerData : any) {
    return this.httpClient.post<any>(this.apiUrl + '/user/register-user-with-business/', {registerData},  httpOptions)
  }
}
