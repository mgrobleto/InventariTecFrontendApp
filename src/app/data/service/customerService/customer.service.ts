import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl = environment.apiUrl;
  token : string | null = null;
  
  constructor (
    private httpClient : HttpClient, 
    private authService: AuthService,
  ) {
    this.token = this.authService.getAuthToken();
    /* this.apiUrl = this.envService.apiUrl */
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  addNewCustomer(data: any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.apiUrl + '/customers/create-customer/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  getAllCustomers() {
    this.refreshAuthToken();    
    return this.httpClient.get<any>(this.apiUrl + '/customers/list-customers/', { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  updateCustomerInfo(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.apiUrl + '/customers/update-customer/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  deleteCustomer(customer_id:string) {
    this.refreshAuthToken();
    const requestBody = { customer_id: customer_id };
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${this.token}`,
      }), 
      body: requestBody
    }
    return this.httpClient.delete(this.apiUrl + '/customers/delete-customer/', httpOptions);
  }

  /* getCustomerType() {
    return this.httpClient.get<any>(this.url + '/typeCustomer/');
  } */
}

