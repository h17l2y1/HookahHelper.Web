import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {SignUpComponent} from "../authorization/sign-up/sign-up.component";
import {LoginComponent} from "../authorization/login/login.component";
import {ConfirmationPopupComponent} from "../shared/components/confirmation-popup/confirmation-popup.component";
import {UserDataService} from "../services/user-data.service";
import {TokenService} from "../services/token.service";
import {UserPermission} from "../shared/user-permission";
import {UserData} from "../interfaces/models/user-data";
import {ThemeService} from "./them-picker/theme.service";
import {Observable, tap} from "rxjs";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends UserPermission {
  public options$: Observable<any> = this.themeService.getThemeOptions();
  public isMobileHeader!: boolean;

  constructor(
    userDataService: UserDataService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private tokenService: TokenService) {
    super(userDataService)
    this.themeService.setTheme("dark");
    this.breakpointObserver.observe(["(max-width: 768px)"]).pipe(
      tap((result: BreakpointState) => {

        if (result.matches) {
          // hide stuff
          this.isMobileHeader = result.matches;
        } else {
          this.isMobileHeader = result.matches;
          // show stuff
        }
      })
    ).subscribe();
  }

  themeChangeHandler(themeToSet: any) {
    this.themeService.setTheme(themeToSet);
  }

  public signUp(): void {
    const dialogRef = this.dialog.open(SignUpComponent, {
      data: null,
      minWidth: '380px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe();
  }

  public login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: null,
      minWidth: '380px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(() => {
      const userData = this.tokenService.getUserData();
      if (userData) {
        this.userDataService.setUser(userData);
      }
    });
  }

  public logout(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.tokenService.logout();
        this.userDataService.setUser(null);
      }
    });
  }

}
