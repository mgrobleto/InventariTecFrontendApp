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
    return this.httpClient.get<any>(this.url + '/category/');
  }

  addCategory(data: any) {
    return this.httpClient.post(this.url + '/category/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data:any) {
    return this.httpClient.put(this.url + '/category/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  delete(id:string){
    return this.httpClient.delete(this.url + '/category/' + id);
  }

  getEquipmentCategories(){
    return this.httpClient.get<any>(this.url + '/equipmentCategory/');
  }
}
