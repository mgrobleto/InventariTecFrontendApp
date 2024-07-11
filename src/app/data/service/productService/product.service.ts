import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpBackend, HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  apiUrl;
  token : string | null = null;

  constructor(
    private httpClient : HttpClient, 
    handler : HttpBackend ,
    private authService : AuthService,
    private envService : EnvironmentService
  ) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
    this.apiUrl = this.envService.apiUrl
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  getAllProducts() {
    this.refreshAuthToken();
    return this.httpClient.get<any>(this.apiUrl + '/products/list-products/', {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  addNewProduct(data : any) {
    this.refreshAuthToken(); 
    return this.httpClient.post(this.apiUrl + '/products/create-product/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  updateProduct(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.apiUrl + '/products/update-product/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    })
  }

  deleteProduct(product_id:string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token),
      body: product_id
    }
    return this.httpClient.delete(this.apiUrl + '/products/delete-product/', httpOptions);
  }

  /* getProductsByCategory(id:any) {
    return this.httpClient.get(this.url + '/products/' + id)
  } */

  /* getProductById(id:any) {
    return this.httpClient.get(this.url + '/products/' + id)
  }

  getProductStock() {
    return this.httpClient.get<any>(this.url + '/productStock/');
  }

  addProductStock(data : any) {
    return this.httpClient.post(this.url + '/productStock/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateProductStock(data:any) {
    return this.httpClient.patch(this.url + '/productStock/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  } */
}
