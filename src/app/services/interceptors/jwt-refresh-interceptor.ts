import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import {AuthService} from "../../authorization/auth.service";
import {catchError, switchMap} from 'rxjs/operators';
import {tap, throwError} from 'rxjs';
import {TokenService} from "../token.service";
import {Tokens} from "../../interfaces/models/tokens";

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            tap((response: Tokens) => {
              this.tokenService.saveToken(response.accessToken);
              this.tokenService.saveRefreshToken(response.refreshToken);
            }),
            switchMap(() => {
              // Retry the original request with the new token
              const updatedRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
                },
              });
              return next.handle(updatedRequest);
            }),
            catchError(() => {
              // Refresh token failed; log out the user or handle the error
              // For example, you can redirect to the login page
              this.tokenService.logout();
              return throwError('Token refresh failed');
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
