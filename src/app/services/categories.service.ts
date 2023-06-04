import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient) { }

  getProductsCategories(){
    return this.httpClient.get<any>(this.url + '/category/');
  }
}
