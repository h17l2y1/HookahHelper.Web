import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {AuthService} from "../../authorization/auth.service";
import {catchError, switchMap} from 'rxjs/operators';
import {tap, throwError} from 'rxjs';
import {TokenService} from "../token.service";
import {Tokens} from "../../interfaces/models/tokens";
import {UserData} from "../../interfaces/models/user-data";
import {UserDataSharedService} from "../shared/user-data-shared.service";

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService, private userDataService: UserDataSharedService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            tap((response: Tokens) => {
              this.tokenService.saveTokens(response);
            }),
            switchMap(() => {
              const updatedRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
                },
              });
              return next.handle(updatedRequest);
            }),
            catchError(() => {
              this.tokenService.logout();
              this.userDataService.setUser({isAdmin: false} as UserData);
              return throwError('Token refresh failed');
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
