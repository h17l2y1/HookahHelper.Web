import { Injectable } from '@angular/core';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {UserData} from "../interfaces/models/user-data";
import {Tokens} from "../interfaces/models/tokens";

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable()
export class TokenService {
  constructor() { }

  public logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public saveTokens(tokens: Tokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public isAdmin(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token === null || token === 'undefined') {
      return false;
    }

    const decoded = jwtDecode<JwtPayload>(token) as { role: string };
    return decoded.role === 'admin';
  }

  public getUserData(): UserData | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || token === 'undefined') {
      return null;
    }

    const decoded = jwtDecode<JwtPayload>(token) as UserData;
    return {
      name: decoded.name,
      isAdmin: decoded.role === 'admin',
      email: decoded.email,
      avatar: decoded.avatar,
      role: decoded.role,
    };
  }

}
