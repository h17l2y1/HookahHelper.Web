import { provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { StarRatingModule } from 'angular-star-rating';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/authorization/auth.service';
import { BrandFilterOptionsResolver } from './app/brand/brand-filter-options.resolver';
import { BrandQueryParamResolver } from './app/brand/brand-query-param.resolver';
import { BrandService } from './app/brand/brand.service';
import { FilterSharedService } from './app/tobacco/filter-shared.service';
import { NamePipe } from './app/shared/pipes/name.pipe';
import { StyleManagerService } from './app/sidenav/them-picker/style-manager.service';
import { ThemeService } from './app/sidenav/them-picker/theme.service';
import { CountryService } from './app/services/country.service';
import { AdminGuard } from './app/services/guards/admin.guard';
import { AuthGuard } from './app/services/guards/auth.guard';
import { AuthInterceptor } from './app/services/interceptors/auth-interceptor';
import { ConfirmNotificationInterceptor } from './app/services/interceptors/confirm-notification-interceptor';
import { ErrorInterceptor } from './app/services/interceptors/error-interceptor';
import { JwtRefreshInterceptor } from './app/services/interceptors/jwt-refresh-interceptor';
import { HeavinessService } from './app/services/heaviness.service';
import { LineService } from './app/services/line.service';
import { ReviewService } from './app/services/review.service';
import { TobaccoResolver } from './app/services/resolvers/tobacco.resolver';
import { TokenService } from './app/services/token.service';
import { DndDirective } from './app/shared/components/image-upload/dnd.directive';
import { TagService } from './app/tag/tag.service';
import { TobaccoService } from './app/tobacco/tobacco.service';
import { TobaccoFilterOptionsResolver } from './app/tobacco/tobacco-table/tobacco-filter-options.resolver';
import { TobaccoLinesResolver } from './app/tobacco/tobacco-table/tobacco-lines.resolver';
import { TobaccoQueryParamResolver } from './app/tobacco/tobacco-table/tobacco-query-param.resolver';
import { TopMixService } from './app/top-mix/top-mix.service';

defineElement(lottie.loadAnimation);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ToastrModule.forRoot(), StarRatingModule.forRoot()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ConfirmNotificationInterceptor, multi: true },
    provideZoneChangeDetection(),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    AuthService,
    AuthGuard,
    AdminGuard,
    TokenService,
    StyleManagerService,
    ThemeService,
    NamePipe,
    BrandService,
    CountryService,
    BrandFilterOptionsResolver,
    BrandQueryParamResolver,
    TobaccoService,
    LineService,
    HeavinessService,
    TagService,
    ReviewService,
    TobaccoResolver,
    TobaccoFilterOptionsResolver,
    TobaccoQueryParamResolver,
    TobaccoLinesResolver,
    FilterSharedService,
    TopMixService,
    DndDirective,
  ],
}).catch((err) => console.error(err));
