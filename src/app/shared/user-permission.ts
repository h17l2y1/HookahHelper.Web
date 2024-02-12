import {UserData} from "../interfaces/models/user-data";
import {UserDataService} from "../services/user-data.service";

export class UserPermission {
  public user?: UserData | null;

  constructor(protected userDataService: UserDataService) {
    this.userDataService.getUser.subscribe(userData => {
      this.user = userData;
    });
  }
}
