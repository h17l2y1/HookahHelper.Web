import {Injectable} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {NotificationHandler} from "../hanflers/notification.handler";

@Injectable()
export class ConfirmNotificationInterceptor implements HttpInterceptor {

  constructor(private confirmHandler: NotificationHandler) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === 200) {
          this.confirmHandler.handleConfirm(request)
        }
      })
    );
  }
}
