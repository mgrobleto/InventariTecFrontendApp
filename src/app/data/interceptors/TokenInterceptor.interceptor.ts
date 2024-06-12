import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../../core/auth/services/auth.service';
import { LoginService } from 'src/app/core/auth/services/login/login.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private loginService: LoginService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    //const token  = this.authService.getAuthToken();

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });

      return next.handle(request)
    } else {
      return next.handle(request);
    }
   /*  return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.loginService.logOut();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    ); */
  }
}
