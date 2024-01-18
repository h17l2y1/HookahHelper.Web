import {Component} from '@angular/core';
import {RoleService} from "./services/role.service";
import {TokenService} from "./services/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private roleService: RoleService, private tokenService: TokenService) {
    const isAdmin = this.tokenService.isAdmin();
    this.roleService.setAdminRole(isAdmin);
  }
}
