import { Injectable } from '@angular/core';
import { StyleManagerService } from './style-manager.service';

export type ThemeMode = 'dark' | 'light';

@Injectable()
export class ThemeService {
  private readonly themeStorageKey = 'hookah_theme_mode';
  private readonly themeMap: Record<ThemeMode, string> = {
    dark: 'dark',
    light: 'indigo-pink',
  };

  constructor(private styleManager: StyleManagerService) {}

  initTheme(): ThemeMode {
    const storedTheme = this.getStoredTheme();
    const theme = storedTheme ?? 'dark';
    this.applyTheme(theme);
    return theme;
  }

  setTheme(themeToSet: ThemeMode): void {
    this.applyTheme(themeToSet);
    localStorage.setItem(this.themeStorageKey, themeToSet);
  }

  toggleTheme(isLightTheme: boolean): void {
    this.setTheme(isLightTheme ? 'light' : 'dark');
  }

  isLightTheme(): boolean {
    return this.getStoredTheme() === 'light';
  }

  getThemeLabel(): string {
    return this.isLightTheme() ? 'Light mode' : 'Dark mode';
  }

  private applyTheme(themeToSet: ThemeMode): void {
    this.styleManager.setStyle('theme', `/assets/styles/${this.themeMap[themeToSet]}.css`);
  }

  private getStoredTheme(): ThemeMode | null {
    const value = localStorage.getItem(this.themeStorageKey);
    if (value === 'dark' || value === 'light') {
      return value;
    }
    return null;
  }
}
