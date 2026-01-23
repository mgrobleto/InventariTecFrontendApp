import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
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

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorDetail = err.error?.detail || err.error?.message || '';
        const errorString = typeof err.error === 'string' ? err.error : JSON.stringify(err.error || {});
        const isInvalidToken =
          err.status === 401 ||
          err.status === 403 ||
          (errorDetail && errorDetail.toString().toLowerCase().includes('invalid token')) ||
          (errorString && errorString.toLowerCase().includes('invalid token'));

        if (isInvalidToken) {
          this.authService.clearAuthToken();
          this.loginService.logOut();
        }

        return throwError(() => err);
      })
    );
  }
}


