import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  url = environment.apiUrl;
  
  constructor(private httpClient : HttpClient) { }

  getAllEquipment(){
    return this.httpClient.get<any>(this.url + '/equipment/');
  }

  addEquipment(data: any) {
    return this.httpClient.post(this.url + '/equipment/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data:any) {
    return this.httpClient.put(this.url + '/equipment/' + data.id + '/', data,{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  delete(id:string){
    return this.httpClient.delete(this.url + '/equipment/' + id);
  }
}
