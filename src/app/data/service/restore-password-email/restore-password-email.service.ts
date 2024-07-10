import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestorePasswordEmailService {

  url = environment.apiUrl;

  constructor(private httpClient : HttpClient, handler : HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  sendEmail(email : string) {
    const data = {
      email: email
    };
    return this.httpClient.post(this.url + '/restore/password-reset/', data);
  }
}
