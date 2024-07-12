import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpBackend} from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  apiUrl = environment.apiUrl;
  token : string | null = null;

  constructor (
    private httpClient : HttpClient, 
    handler: HttpBackend , 
    private authService: AuthService,
  ) {
    this.httpClient = new HttpClient(handler);
    this.token =  this.authService.getAuthToken();
    /* this.apiUrl = environment.apiUrl + '/suppliers'; */
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  addNewSupplier (data : any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.apiUrl + '/suppliers/create-supplier/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  updateSupplier (data : any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.apiUrl + '/suppliers/update-supplier/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  // or pass id
  deleteSupplier (supplier_id : any) {
    this.refreshAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${this.token}`,
      }), 
      body: supplier_id
    }
    return this.httpClient.delete(this.apiUrl + '/suppliers/delete-supplier/', httpOptions);
  }

  getAllSuppliers () {
    this.refreshAuthToken();
    return this.httpClient.get(this.apiUrl + '/suppliers/list-suppliers/', { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }
}
