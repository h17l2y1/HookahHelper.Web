import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {SignUpComponent} from "../authorization/sign-up/sign-up.component";
import {LoginComponent} from "../authorization/login/login.component";
import {ConfirmationPopupComponent} from "../shared/components/confirmation-popup/confirmation-popup.component";
import {UserDataService} from "../services/user-data.service";
import {TokenService} from "../services/token.service";
import {UserPermission} from "../shared/user-permission";

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends UserPermission {

  constructor(userDataService: UserDataService, private dialog: MatDialog, private tokenService: TokenService) {
    super(userDataService)
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

}
