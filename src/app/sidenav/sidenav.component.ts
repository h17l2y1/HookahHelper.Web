import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationService} from "../services/authorization.service";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {SignUpComponent} from "../authorization/sign-up/sign-up.component";

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(
    public dialog: MatDialog,
    private authorizationService:AuthorizationService) {
  }
  public signUp(): void {
    const dialogRef = this.dialog.open(SignUpComponent, {
      data: null,
      minWidth: '380px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
    //   if (resp) {
    //     this.signUp();
    //   }
    //   this.getTags()
    });
  }
}
