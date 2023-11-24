import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  url = environment.apiUrl + '/suppliers';

  constructor(private httpClient : HttpClient, private authService: AuthService) { }

  token = this.authService.getAuthToken();
  
  headerObj = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.token}`,
  })

  addNewSupplier (data : any) {
    return this.httpClient.post(this.url + '/create-supplier/', data, { headers: this.headerObj });
  }

  updateSupplier (data : any) {
    return this.httpClient.put(this.url + '/update-supplier/', data, { headers: this.headerObj });
  }

  // or pass id
  deleteSupplier (supplier_id : any) {
    const httpOptions = {
      headers: this.headerObj, 
      body: supplier_id
    }
    return this.httpClient.delete(this.url + '/delete-supplier/', httpOptions);
  }

  getAllSuppliers () {
    return this.httpClient.get(this.url + '/list-suppliers/', { headers: this.headerObj });
  }
}
