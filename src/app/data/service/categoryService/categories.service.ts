import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient) { }

  getProductsCategories(){
    return this.httpClient.get<any>(this.url + '/products_category/list-product-categories/');
  }

  createNewCategory(data: any) {
    return this.httpClient.post(this.url + '/create-product-category/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateProductCategory(data:any) {
    return this.httpClient.put(this.url + '/products_category/update-product-category/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  deleteProductCategory(id:string){
    return this.httpClient.delete(this.url + '/products_category/delete-product-category/' + id);
  }
}
