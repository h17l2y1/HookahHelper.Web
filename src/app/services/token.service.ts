import { Injectable } from '@angular/core';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {UserData} from "../interfaces/models/user-data";

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable()
export class TokenService {
  constructor() { }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public saveToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
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
    if (token === null || token === 'undefined') {
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
