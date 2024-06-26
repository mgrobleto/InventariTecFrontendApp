import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient, handler : HttpBackend) { 
    this.httpClient = new HttpClient(handler);
  }

  getPaymentType() {
    return this.httpClient.get(this.url + '/api/payment-types/', { headers:{'Content-Type': 'application/json'}});
  }

}
