import {Component} from '@angular/core';
import {UserDataSharedService} from "./services/shared/user-data-shared.service";
import {TokenService} from "./services/token.service";
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [SidenavComponent]
})
export class AppComponent {

  constructor(private userDataService: UserDataSharedService, private tokenService: TokenService) {
    const userData = this.tokenService.getUserData();
    if (userData){
      this.userDataService.setUser(userData);
    }
  }
}
