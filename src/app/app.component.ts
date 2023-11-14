import { Component } from '@angular/core';
import {PublicService} from './data/service/public.service';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CsrfTokenService } from './core/auth/services/csrf-token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tecnorefill';
  msg:any;
  apiURL = environment.apiUrl;

  constructor(private pService: PublicService, private http: HttpClient, private csrfService : CsrfTokenService){}

  ngOnInit() {
    this.showMessage()
    this.fetchCsrfToken()
  }


  fetchCsrfToken() {
    this.http.get(this.apiURL + '/get_csrf_token/').subscribe(
      (data : any) => {
        this.csrfService.setCsrfToken(data.csrf_token)
        //console.log(data.csrf_token)
      },
      err => console.log('no se obtuvo el csrf token',err)
    )
  }
  

  showMessage(){
    this.pService.getMessage().subscribe(data => {
      this.msg = data,
      console.log(this.msg);
    });
  }
}
