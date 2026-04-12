import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-popup',
    templateUrl: './confirmation-popup.component.html',
    styleUrls: ['./confirmation-popup.component.scss'],
    imports: [MatDialogTitle, MatButton]
})
export class ConfirmationPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
  ) {}

  onAction(yesOrNo: boolean) {
    this.dialogRef.close(yesOrNo);
  }
}
