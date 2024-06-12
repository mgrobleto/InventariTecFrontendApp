import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategorieService {

  url = environment.apiUrl;
  token : string | null = null;
  
  constructor (
    private httpClient : HttpClient, 
    handler : HttpBackend , 
    private authService : AuthService
  ) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
  }

  
  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  getProductsCategories() {
    this.refreshAuthToken();
    return this.httpClient.get<any>(this.url + '/products_category/list-product-categories/', {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  createNewCategory(data: any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.url + '/products_category/create-product-category/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  updateProductCategory(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.url + '/products_category/update-product-category/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    })
  }

  deleteProductCategory(product_category_id:string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token),
      body: product_category_id
    }
    return this.httpClient.delete(this.url + '/products_category/delete-product-category/', httpOptions);
  }
}
