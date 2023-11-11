import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsrfTokenService {

  apiURL = environment.apiUrl;

  private csrfToken: string | null | undefined;


  constructor() { }

  setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  getCsrfToken() { return this.csrfToken; }

}
