import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';
const REFRESHTOKEN_KEY = 'refresh_token';

@Injectable()

export class TokenService {
  constructor() { }

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);

    // const user = this.getUser();
    // if (user.id) {
    //   this.saveUser({ ...user, accessToken: token });
    // }
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESHTOKEN_KEY);
  }
}
