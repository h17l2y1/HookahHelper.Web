import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/entity/user";
import {Tokens} from "../interfaces/models/tokens";
import {JwtHelperService} from "@auth0/angular-jwt";
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable()

export class AuthorizationService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public createUser(data: User): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Account/SignUp', data);
  }

  public authorization(data: User): Observable<Tokens> {
    return this.http.post<Tokens>(this.rootUrl + 'Account/Login', data);
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public getUserRole() {
    const role: string | null = localStorage.getItem('role');
    return role;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (token === null) {
      return false
    }
    const decoded = jwtDecode<JwtPayload>(token);


    if (decoded.exp === undefined) {
      return false
    }
    const expDate = new Date(0).setUTCSeconds(decoded.exp);
    return new Date().valueOf() < expDate.valueOf();
  }

  refreshToken(token: string) {
    return this.http.post<any>(this.rootUrl + 'RefreshToken', {
      refreshToken: token
    })
  }
}
