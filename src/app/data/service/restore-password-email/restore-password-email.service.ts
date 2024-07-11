import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class RestorePasswordEmailService {

  apiUrl;

  constructor(
    private httpClient : HttpClient,
    private envService: EnvironmentService,
    handler : HttpBackend,
  ) {
    this.httpClient = new HttpClient(handler);
    this.apiUrl = this.envService.apiUrl
  }

  sendEmail(email : string) {
    const data = {
      email: email
    };
    return this.httpClient.post(this.apiUrl + '/restore/password-reset/', data);
  }
}
