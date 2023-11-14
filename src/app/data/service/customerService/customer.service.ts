import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient) { }

  addNewCustomer(data: any) {
    return this.httpClient.post(this.url + '/customers/create-customer/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllCustomers(){
    return this.httpClient.get<any>(this.url + '/customers/list-customers/');
  }

  updateCustomerInfo(data:any) {
    return this.httpClient.put(this.url + '/customers/update-customer/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteCustomer(id:string){
    return this.httpClient.delete(this.url + '/customers/delete-customer/' + id + '/');
  }

  getCustomerType() {
    return this.httpClient.get<any>(this.url + '/typeCustomer/');
  }
}
