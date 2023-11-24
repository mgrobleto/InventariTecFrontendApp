import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl;

  constructor(private httpClient : HttpClient, private authService : AuthService){}

  token = this.authService.getAuthToken();

  headerObj = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${this.token}`,
  })

  getAllProducts(){
    return this.httpClient.get<any>(this.url + '/products/list-products/', { headers: this.headerObj });
  }

  addNewProduct(data : any) {
    return this.httpClient.post(this.url + '/products/create-product/', data, { headers: this.headerObj });
  }

  updateProduct(data:any) {
    return this.httpClient.put(this.url + '/products/update-product/', data, { headers: this.headerObj })
  }

  deleteProduct(product_id:string) {
    const httpOptions = {
      headers: this.headerObj, 
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
