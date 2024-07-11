import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EnvironmentService } from 'src/environments/environment.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  apiUrl;

  constructor(private httpClient : HttpClient, handler : HttpBackend, private envService: EnvironmentService) { 
    this.httpClient = new HttpClient(handler);
    this.apiUrl = this.envService.apiUrl
  }

  getCurrency() {
    return this.httpClient.get(this.apiUrl + '/api/currencies/');
  }
}
