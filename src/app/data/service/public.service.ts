import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PublicService {

  api_url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMessage(){
    return this.http.get(this.api_url)
  }
}
