import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {
  @Input() public title = 'Confirmation';
  @Input() public description = 'Are you sure you want to continue? This action cannot be undone.';
  @Input() public confirmText = 'Delete';
  @Input() public cancelText = 'Cancel';
  @Input() public confirmTone: 'danger' | 'warning' = 'danger';

  @Output() public confirmed = new EventEmitter<void>();
  @Output() public cancelled = new EventEmitter<void>();

  public onConfirm(): void {
    this.confirmed.emit();
  }

  public onCancel(): void {
    this.cancelled.emit();
  }
}
