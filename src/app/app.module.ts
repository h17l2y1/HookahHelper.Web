import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AppComponent} from './app.component';
import {SidenavComponent} from "./sidenav/sidenav.component";
import {AppRoutingModule} from "./app-routing.module";
import {provideToastr, ToastrModule} from "ngx-toastr";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {ErrorInterceptor} from "./services/interceptors/error-interceptor";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
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
import {MatGridListModule} from "@angular/material/grid-list";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({ declarations: [
        AppComponent,
        SidenavComponent,
        ThemePickerComponent,
    ],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        RouterModule,
        AppRoutingModule,
        MatExpansionModule,
        MatTooltipModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        MatTabsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        SharedModule,
        AuthorizationModule,
        MatGridListModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ConfirmNotificationInterceptor, multi: true },
        AuthGuard,
        AdminGuard,
        TokenService,
        provideAnimations(),
        provideToastr(),
        StyleManagerService,
        ThemeService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
