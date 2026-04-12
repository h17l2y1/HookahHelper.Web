import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ThemeService } from './theme.service';
import {Option} from "./option.model";
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-them-picker',
    templateUrl: './theme-picker.component.html',
    imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})
export class ThemePickerComponent {
  @Input() options!: Option[];
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private themeService: ThemeService) {}

  changeTheme(themeToSet: any) {
    this.themeChange.emit(themeToSet);
  }
}
