import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  apiUrl = environment.apiUrl

  constructor(private httpClient : HttpClient, handler : HttpBackend) { 
    this.httpClient = new HttpClient(handler);
  }

  getCurrency() {
    return this.httpClient.get(this.apiUrl + '/api/currencies/');
  }
}
