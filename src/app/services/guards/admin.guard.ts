import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {TokenService} from "../token.service";
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(public tokenService: TokenService) {}

  public canActivate(): boolean {
    return this.tokenService.isAdmin();
  }
}
