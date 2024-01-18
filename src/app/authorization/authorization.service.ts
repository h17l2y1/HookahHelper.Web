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

  public signUp(data: User): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Account/SignUp', data);
  }

  public login(data: User): Observable<Tokens> {
    return this.http.post<Tokens>(this.rootUrl + 'Account/Login', data);
  }

  public refreshToken(token: string) {
    return this.http.post<any>(this.rootUrl + 'RefreshToken', {
      refreshToken: token
    })
  }
}
