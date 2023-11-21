import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  url = environment.apiUrl + '/suppliers';

  constructor(private httpClient : HttpClient) { }

  addNewSupplier (data : any) {
    return this.httpClient.post(this.url + '/create-supplier/', data, {
      headers : new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateSupplier (data : any) {
    return this.httpClient.put(this.url + '/update-supplier/' + data.id + '/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  // or pass id
  deleteSupplier (data : any) {
    return this.httpClient.delete(this.url + '/delete-supplier/' + data.id + '/');
  }

  getAllSuppliers () {
    return this.httpClient.get(this.url + '/list-suppliers/');
  }
}
