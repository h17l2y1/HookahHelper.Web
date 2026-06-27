import {Component, OnDestroy} from '@angular/core';
import {UserDataSharedService} from "../services/shared/user-data-shared.service";
import {TokenService} from "../services/token.service";
import {UserPermission} from "../shared/user-permission";
import {ThemeService} from "./them-picker/theme.service";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Router} from "@angular/router";

enum Screen {
  XSmall = 'XSmall',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  XLarge = 'XLarge',
}

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends UserPermission implements OnDestroy {
  public options$: Observable<any> = this.themeService.getThemeOptions();
  public isMobile!: boolean;
  public inDevelop: boolean = true;
  public currentScreenSize!: string;
  public userMenuOpen = false;
  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    userDataService: UserDataSharedService,
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private tokenService: TokenService,
    private router: Router) {
    super(userDataService);
    this.themeService.setTheme("dark");

    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        '(max-width: 767px)',
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        takeUntil(this.destroyed),
        tap(() => {
          if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
            this.currentScreenSize = 'XSmall';
            this.isMobile = true;
          }
          if (this.breakpointObserver.isMatched('(max-width: 767px)')) {
            this.isMobile = true;
            return;
          }
          if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
            this.currentScreenSize = 'Small';
            this.isMobile = false;
          }
          if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
            this.currentScreenSize = 'Medium';
            this.isMobile = false;
          }
          if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
            this.currentScreenSize = 'Large';
            this.isMobile = false;
          }
          if (this.breakpointObserver.isMatched(Breakpoints.XLarge)) {
            this.currentScreenSize = 'XLarge';
            this.isMobile = false;
          }
        })
      ).subscribe();
  }

  themeChangeHandler(themeToSet: any) {
    this.themeService.setTheme(themeToSet);
  }

  public signUp(): void {
    void this.router.navigate(['/sign-up']);
  }

  public login(): void {
    void this.router.navigate(['/login']);
  }

  public logout(): void {
    if (window.confirm('Log out?')) {
      this.tokenService.logout();
      this.userDataService.setUser(null);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected readonly Screen = Screen;
}
