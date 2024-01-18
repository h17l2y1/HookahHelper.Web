import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {SignUpComponent} from "../authorization/sign-up/sign-up.component";
import {LoginComponent} from "../authorization/login/login.component";
import {ConfirmationPopupComponent} from "../shared/components/confirmation-popup/confirmation-popup.component";
import {RoleService} from "../services/role.service";

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public isAdmin$ = this.roleService.isAdmin;

  constructor(public dialog: MatDialog, private roleService: RoleService) {}

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

    dialogRef.afterClosed().subscribe();
  }

  public logout(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        localStorage.clear();
        this.roleService.setAdminRole(false);
      }
    });
  }

}
