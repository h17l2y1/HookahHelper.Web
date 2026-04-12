import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/entity/user";
import {Tokens} from "../interfaces/models/tokens";
import {TokenService} from "../services/token.service";

@Injectable()

export class AuthService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public signUp(data: User): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Account/SignUp', data);
  }

  public login(data: User): Observable<Tokens> {
    return this.http.post<Tokens>(this.rootUrl + 'Account/Login', data);
  }

  public refreshToken(): Observable<Tokens> {
    const token = this.tokenService.getRefreshToken();
    return this.http.post<Tokens>(this.rootUrl + 'Account/RefreshAuthToken', {refreshToken: token})
  }
}
