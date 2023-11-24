import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategorieService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient, private authService : AuthService) { }

  token = this.authService.getAuthToken();

  headerObj = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.token}`,
  })

  getProductsCategories(){
    return this.httpClient.get<any>(this.url + '/products_category/list-product-categories/', { headers: this.headerObj });
  }

  createNewCategory(data: any) {
    return this.httpClient.post(this.url + '/products_category/create-product-category/', data, { headers: this.headerObj });
  }

  updateProductCategory(data:any) {
    return this.httpClient.put(this.url + '/products_category/update-product-category/', data, { headers: this.headerObj })
  }

  deleteProductCategory(product_category_id:string) {
    const httpOptions = {
      headers: this.headerObj, 
      body: product_category_id
    }
    return this.httpClient.delete(this.url + '/products_category/delete-product-category/', httpOptions);
  }
}
