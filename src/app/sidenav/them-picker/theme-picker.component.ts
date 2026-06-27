import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import { ThemeService } from './theme.service';
import {Option} from "./option.model";

@Component({
  selector: 'app-them-picker',
  templateUrl: './theme-picker.component.html'
})
export class ThemePickerComponent {
  @Input() options!: Option[];
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();
  public isOpen = false;

  constructor(private themeService: ThemeService) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.theme-picker')) {
      this.isOpen = false;
    }
  }

  changeTheme(themeToSet: any) {
    this.themeChange.emit(themeToSet);
    this.isOpen = false;
  }
}
