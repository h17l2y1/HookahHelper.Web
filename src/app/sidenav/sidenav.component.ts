import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationService} from "../services/authorization.service";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {SignUpComponent} from "../authorization/sign-up/sign-up.component";
import {LoginComponent} from "../authorization/login/login.component";
import {ConfirmationPopupComponent} from "../shared/components/confirmation-popup/confirmation-popup.component";
import {tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  role = this.authorizationService.getUserRole();
  role2 = this.authorizationService.getUserRole();

  constructor(
    public dialog: MatDialog,
    private authorizationService: AuthorizationService,
    private router: Router) {
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

    dialogRef.afterClosed().subscribe(resp => {
      // if (resp) {
      //   this.login();
      // }
      //   this.getTags()

      // this.router.navigate([this.router.url]);
      window.location.reload();
    });
  }

  public logout(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        // this.router.navigate(['']);
        window.location.reload();
      }
    });
  }
}
