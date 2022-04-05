import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorData) => {
        if (errorData) {
          switch (errorData.status) {
            case 400:
              if (errorData.error.errors) {
                throw errorData.error;
              } else {
                this.toastr.error(
                  errorData.error.message,
                  errorData.error.statusCode
                );
              }
              break;
            case 401:
              this.toastr.error(
                errorData.error.message,
                errorData.error.statusCode
              );
              break;
            case 404:
              this.toastr.error(
                errorData.error.message,
                errorData.error.statusCode
              );
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: errorData.error}};
              this.toastr.error(
                errorData.error.message,
                errorData.error.statusCode
              );
              break;
            default:
              break;
          }
        }
        return throwError(() => new Error(errorData));
      })
    );
  }
}
