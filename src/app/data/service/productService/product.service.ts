import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl;

  constructor(private httpClient : HttpClient){}

  getAllProducts(){
    return this.httpClient.get<any>(this.url + '/products/list-products/');
  }

  addNewProduct(data : any) {
    return this.httpClient.post(this.url + '/products/create-product/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateProduct(data:any) {
    return this.httpClient.put(this.url + '/products/update-product/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteProduct(id:string){
    return this.httpClient.delete(this.url + '/products/delete-product/' + id);
  }

  /* getProductsByCategory(id:any) {
    return this.httpClient.get(this.url + '/products/' + id)
  } */

  getProductById(id:any) {
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
  }
}
