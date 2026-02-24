import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublicService } from './data/service/public.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionTimeoutService } from './core/services/session-timeout.service';
import { AuthService } from './core/auth/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'tecnorefill';
  msg: any;
  apiURL = environment.apiUrl;
  private authSub: Subscription | null = null;

  constructor(
    private pService: PublicService,
    private http: HttpClient,
    private sessionTimeoutService: SessionTimeoutService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to auth state to start/stop idle timeout tracking
    this.authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.sessionTimeoutService.startWatching();
      } else {
        this.sessionTimeoutService.stopWatching();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }


  /* fetchCsrfToken() {
    this.http.get(this.apiURL + '/get_csrf_token/').subscribe(
      (data : any) => {
        this.csrfService.setCsrfToken(data.csrf_token)
        //console.log(data.csrf_token)
      },
      err => console.log('no se obtuvo el csrf token',err)
    )
  } */


  // Removed unused API root call to avoid 404 noise.
}

