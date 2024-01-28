import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UserData} from "../interfaces/models/user-data";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private userData = new BehaviorSubject<UserData>({} as UserData);
  public getUserData = this.userData.asObservable();

  constructor() { }

  public setUserData(userData: UserData){
    this.userData.next(userData)
  }

}
