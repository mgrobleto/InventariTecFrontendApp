import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, handler : HttpBackend) { 
    this.httpClient = new HttpClient(handler);
    /* this.apiUrl = this.envService.apiUrl */
  }

  getPaymentType() {
    return this.httpClient.get(this.apiUrl + '/api/payment-types/', { headers:{'Content-Type': 'application/json'}});
  }

}

