import {UserData} from "../interfaces/models/user-data";
import {UserDataSharedService} from "../services/shared/user-data-shared.service";

export class UserPermission {
  public user?: UserData | null;

  constructor(protected userDataService: UserDataSharedService) {
    this.userDataService.getUser.subscribe(userData => {
      this.user = userData;
    });
  }
}
