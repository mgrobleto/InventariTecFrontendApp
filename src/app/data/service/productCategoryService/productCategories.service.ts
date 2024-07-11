import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategorieService {

  apiUrl;
  token : string | null = null;
  
  constructor (
    private httpClient : HttpClient, 
    handler : HttpBackend , 
    private authService : AuthService,
    private envService: EnvironmentService
  ) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
    this.apiUrl = this.envService.apiUrl
  }

  
  refreshAuthToken() {
    this.token = this.authService.getAuthToken();
  }

  getProductsCategories() {
    this.refreshAuthToken();
    return this.httpClient.get<any>(this.apiUrl + '/products_category/list-product-categories/', {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  createNewCategory(data: any) {
    this.refreshAuthToken();
    return this.httpClient.post(this.apiUrl + '/products_category/create-product-category/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    });
  }

  updateProductCategory(data:any) {
    this.refreshAuthToken();
    return this.httpClient.put(this.apiUrl + '/products_category/update-product-category/', data, {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token)
    })
  }

  deleteProductCategory(product_category_id:string) {
    this.refreshAuthToken();
    const httpOptions = {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token),
      body: product_category_id
    }
    return this.httpClient.delete(this.apiUrl + '/products_category/delete-product-category/', httpOptions);
  }
}
