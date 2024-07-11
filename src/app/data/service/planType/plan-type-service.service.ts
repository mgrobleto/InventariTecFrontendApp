import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanTypeService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, handler : HttpBackend) {
    this.httpClient = new HttpClient(handler);
    /* this.apiUrl = this.envService.apiUrl */
  }

  getPlanType() {
    return this.httpClient.get(this.apiUrl + '/api/plan-types/');
  }
}
