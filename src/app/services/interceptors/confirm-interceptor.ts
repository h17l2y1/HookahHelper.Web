import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {GlobalErrorHandler} from "../error.handler";
import {ConfirmHandler} from "../confirm.handler";

@Injectable()
export class ConfirmInterceptor implements HttpInterceptor {

  constructor(private confirm: ConfirmHandler) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === 200) {
          this.confirm.handleConfirm(request)
          // console.log('HTTP Response:', event);
        }
      })
    );
  }
}
