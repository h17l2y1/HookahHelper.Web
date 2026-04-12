import {Injectable} from "@angular/core";
import {TokenService} from "../token.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable()
export class AdminGuard {

  readonly rootUrl: string = environment.apiUrl;

  constructor(public tokenService: TokenService, private http: HttpClient) {}

  public canActivate(): Observable<boolean> {
    return this.http.get<boolean>(this.rootUrl + 'Account/IsAdmin').pipe(
      map(response => {
        return this.tokenService.isAdmin() && response
      }),
    );
  }
}
