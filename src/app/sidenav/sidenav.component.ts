import {Component, OnDestroy} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {UserDataSharedService} from '../services/shared/user-data-shared.service';
import {TokenService} from '../services/token.service';
import {UserPermission} from '../shared/user-permission';
import {ThemeService} from './them-picker/theme.service';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends UserPermission implements OnDestroy {
  public isMobile = false;
  public sidebarCollapsed = false;
  public inDevelop = true;
  public userMenuOpen = false;
  public isLightTheme = false;
  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    userDataService: UserDataSharedService,
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private tokenService: TokenService,
    private router: Router) {
    super(userDataService);
    this.isLightTheme = this.themeService.initTheme() === 'light';

    this.breakpointObserver
      .observe([Breakpoints.XSmall, '(max-width: 767px)'])
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.isMobile = this.breakpointObserver.isMatched(Breakpoints.XSmall) || this.breakpointObserver.isMatched('(max-width: 767px)');
        this.sidebarCollapsed = this.isMobile;
      });
  }

  themeChangeHandler(isLightTheme: boolean): void {
    this.isLightTheme = isLightTheme;
    this.themeService.toggleTheme(isLightTheme);
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

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
