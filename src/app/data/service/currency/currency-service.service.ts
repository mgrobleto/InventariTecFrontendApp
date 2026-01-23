import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient : HttpClient) { 
    /* this.apiUrl = this.envService.apiUrl */
  }

  getCurrency() {
    return this.httpClient.get(this.apiUrl + '/api/currencies/');
  }
}

