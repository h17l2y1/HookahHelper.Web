import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {GlobalErrorHandler} from "./error-handler";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private error: GlobalErrorHandler) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable((observer) => {
      next.handle(req).subscribe(res => {
          if (res instanceof HttpResponse) {
            observer.next(res);
          }
        },
        (err: HttpErrorResponse) => {
          this.error.handleError(err);
        }
      );
    });
  }
}
