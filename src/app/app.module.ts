import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule, Routes} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AppComponent} from './app.component';
import {SidenavComponent} from "./sidenav/sidenav.component";
import {AppRoutingModule} from "./app-routing.module";
import {SharedModule} from "./shared/shared.module";
import {ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor} from "./services/error-interceptor";
import {GlobalErrorHandler} from "./services/error-handler";

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
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
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
