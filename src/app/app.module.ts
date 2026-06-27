import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {SidenavComponent} from "./sidenav/sidenav.component";
import {AppRoutingModule} from "./app-routing.module";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./services/interceptors/error-interceptor";
import {SharedModule} from "./shared/shared.module";
import {AuthorizationModule} from "./authorization/authorization.module";
import {AuthGuard} from "./services/guards/auth.guard";
import {TokenService} from "./services/token.service";
import {AdminGuard} from "./services/guards/admin.guard";
import {AuthInterceptor} from "./services/interceptors/auth-interceptor";
import {JwtRefreshInterceptor} from "./services/interceptors/jwt-refresh-interceptor";
import {ConfirmNotificationInterceptor} from "./services/interceptors/confirm-notification-interceptor";
import {ThemePickerComponent} from './sidenav/them-picker/theme-picker.component';
import {StyleManagerService} from "./sidenav/them-picker/style-manager.service";
import {ThemeService} from "./sidenav/them-picker/theme.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ThemePickerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    AuthorizationModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ConfirmNotificationInterceptor, multi: true},
    AuthGuard,
    AdminGuard,
    TokenService,
    provideAnimations(),
    provideToastr(),
    StyleManagerService,
    ThemeService,
  ],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
