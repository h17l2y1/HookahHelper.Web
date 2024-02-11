import {Injectable} from '@angular/core';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {UserData} from "../interfaces/models/user-data";

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable()
export class TokenService {
  constructor() { }

  public logout(): void {
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
    const token = this.isTokenExist();
    if (!token) {
      return false;
    }

    const isTokenValid = this.isTokenValid(token)
    if (!isTokenValid) {
      return false;
    }

    const decoded = jwtDecode<JwtPayload>(token) as { role: string };
    return decoded.role === 'admin';
  }

  public isLoggedIn(): boolean {
    const token = this.isTokenExist();
    if (!token) {
      return false;
    }

    return this.isTokenValid(token);
  }

  public isTokenValid(token: string): boolean {
    const now = Date.now();
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp){
      if (now > decoded.exp){
        return false;
      }
    }

    return true;
  }

  private isTokenExist(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token === null || token === 'undefined') {
      return null;
    }

    return token;
  }

  public getUserData(): UserData | null {
    const token = this.isTokenExist();
    if (!token) {
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
