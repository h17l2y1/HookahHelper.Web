import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthorizationService} from "./authorization.service";

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthorizationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler){
    // const token = JSON.parse(localStorage.getItem('access_token') || '{}');
    const token = localStorage.getItem('access_token');

    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
