import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-them-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent {
  @Input() checked = false;
  @Output() themeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleTheme(): void {
    this.themeChange.emit(!this.checked);
  }
}
