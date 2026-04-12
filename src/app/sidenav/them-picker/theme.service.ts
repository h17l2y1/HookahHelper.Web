import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import {StyleManagerService} from "./style-manager.service";
import {Option} from "./option.model";

@Injectable()
export class ThemeService {
  constructor(
    private http: HttpClient,
    private styleManager: StyleManagerService
  ) {}

  getThemeOptions(): Observable<Option[]> {
    return this.http.get<Option[]>("assets/options.json");
  }

  setTheme(themeToSet: any) {
    this.styleManager.setStyle("theme", `../../../assets/styles/${themeToSet}.css`);
  }
}
