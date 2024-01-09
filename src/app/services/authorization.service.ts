import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/entity/user";
import {Token} from "../interfaces/models/token";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  public createUser(data: User): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Account/SignUp', data);
  }

  public authorization(data: User): Observable<Token> {
    return this.http.post<Token>(this.rootUrl + 'Account/Login', data);
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
  public getUserRole() {
    const role:string|null  = localStorage.getItem('role');
    return role;
  }
}
