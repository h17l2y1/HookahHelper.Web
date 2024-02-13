import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ThemeService } from './theme.service';
import {Option} from "./option.model";

@Component({
  selector: 'app-them-picker',
  templateUrl: './theme-picker.component.html'
})
export class ThemePickerComponent {
  @Input() options!: Option[];
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private themeService: ThemeService) {}

  changeTheme(themeToSet: any) {
    this.themeChange.emit(themeToSet);
  }
}
