import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthorizationService} from "../authorization.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthorizationService, public router: Router) {}
  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }
}
