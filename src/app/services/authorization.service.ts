import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/entity/user";

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
}
