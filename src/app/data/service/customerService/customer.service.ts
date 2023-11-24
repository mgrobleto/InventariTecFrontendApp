import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient, private authService: AuthService) { }

  token = this.authService.getAuthToken();

  headerObj = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.token}`,
  })

  addNewCustomer(data: any) {
    return this.httpClient.post(this.url + '/customers/create-customer/', data, {'headers': this.headerObj });
  }

  getAllCustomers() {
    //var token = this.authService.getAuthToken(); 
    
    return this.httpClient.get<any>(this.url + '/customers/list-customers/', {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  updateCustomerInfo(data:any) {
    return this.httpClient.put(this.url + '/customers/update-customer/', data, { 'headers': this.headerObj });
  }

  deleteCustomer(customer_id:string) {

    const httpOptions = {
      headers: this.headerObj, 
      body: customer_id
    }
    return this.httpClient.delete(this.url + '/customers/delete-customer/', httpOptions);
  }

  /* getCustomerType() {
    return this.httpClient.get<any>(this.url + '/typeCustomer/');
  } */
}
