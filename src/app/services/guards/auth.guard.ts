import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {TokenService} from "../token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public tokenService: TokenService) {}

  public canActivate(): boolean {
    const token = this.tokenService.getAccessToken();
    if (token === null) {
      return false;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp === undefined) {
      return false
    }

    const expDate = new Date(0).setUTCSeconds(decoded.exp);
    return new Date().valueOf() < expDate.valueOf();
  }

}
