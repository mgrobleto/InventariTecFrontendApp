import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategorieService {

  apiUrl = environment.apiUrl;
  token : string | null = null;
  
  constructor (
    private httpClient : HttpClient, 
    handler : HttpBackend , 
    private authService : AuthService,
  ) {
    this.httpClient = new HttpClient(handler);
    this.token = this.authService.getAuthToken();
/*     this.apiUrl = this.envService.apiUrl
 */  }

  
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
    const requestBody = { product_category_id: product_category_id };
    const httpOptions = {
      headers : new HttpHeaders().set('Authorization', 'Token ' + this.token),
      body: requestBody
    }
    return this.httpClient.delete(this.apiUrl + '/products_category/delete-product-category/', httpOptions);
  }
}

