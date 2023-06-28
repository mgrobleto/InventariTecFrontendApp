import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient) { }

  getAllCustomers(){
    return this.httpClient.get<any>(this.url + '/customer/');
  }

  getCustomerType() {
    return this.httpClient.get<any>(this.url + '/typeCustomer/');
  }

  addCustomer(data: any) {
    return this.httpClient.post(this.url + '/customer/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data:any) {
    return this.httpClient.put(this.url + '/customer/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  delete(id:string){
    return this.httpClient.delete(this.url + '/customer/' + id);
  }
}
