import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = environment.apiUrl;
  token : string | null = null;
  
  constructor (
    private httpClient : HttpClient, 
    handler : HttpBackend ,
    private authService: AuthService
  ) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  addNewCustomer(data: any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.url + '/customers/create-customer/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  getAllCustomers() {
    this.refreshAuthToken();    
    return this.httpClient.get<any>(this.url + '/customers/list-customers/', { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  updateCustomerInfo(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.url + '/customers/update-customer/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  deleteCustomer(customer_id:string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${this.token}`,
      }), 
      body: customer_id
    }
    return this.httpClient.delete(this.url + '/customers/delete-customer/', httpOptions);
  }

  /* getCustomerType() {
    return this.httpClient.get<any>(this.url + '/typeCustomer/');
  } */
}
