import {Injectable, Injector} from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const notifier = this.injector.get(ToastrService);

    return next.handle(request).pipe(
      // @ts-ignore
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          notifier.error('Server error');
          // errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('This is server side error');
          // errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        // if (error.status === 401) {
        //   // refresh token
        // } else {
        //   console.log('error')
        //   // return throwError(error);
        //   return throwError('Valid token not returned');
        // }
      })
    );
  }
}
