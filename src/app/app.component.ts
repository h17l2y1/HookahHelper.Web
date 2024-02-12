import {Component} from '@angular/core';
import {UserDataService} from "./services/user-data.service";
import {TokenService} from "./services/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private userDataService: UserDataService, private tokenService: TokenService) {
    const userData = this.tokenService.getUserData();
    if (userData){
      this.userDataService.setUser(userData);
    }
  }
}
