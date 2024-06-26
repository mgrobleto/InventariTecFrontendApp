import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpBackend, HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  url = environment.apiUrl;
  token : string | null = null;

  constructor(private httpClient : HttpClient, handler : HttpBackend ,private authService : AuthService) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
  }

  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  getAllProducts() {
    this.refreshAuthToken();
    return this.httpClient.get<any>(this.url + '/products/list-products/', {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  addNewProduct(data : any) {
    this.refreshAuthToken(); 
    return this.httpClient.post(this.url + '/products/create-product/', data, { headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })});
  }

  updateProduct(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.url + '/products/update-product/', data, {headers : new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    })})
  }

  deleteProduct(product_id:string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${this.token}`,
      }), 
      body: product_id
    }
    return this.httpClient.delete(this.url + '/products/delete-product/', httpOptions);
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
