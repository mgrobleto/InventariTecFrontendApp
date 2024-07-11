import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EnvironmentService } from 'src/environments/environment.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  apiUrl;

  constructor(private httpClient: HttpClient, handler : HttpBackend, private envService: EnvironmentService) { 
    this.httpClient = new HttpClient(handler);
    this.apiUrl = this.envService.apiUrl
  }

  getPaymentType() {
    return this.httpClient.get(this.apiUrl + '/api/payment-types/', { headers:{'Content-Type': 'application/json'}});
  }

}
