import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UserData} from "../interfaces/models/user-data";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userData = new BehaviorSubject<UserData | null>(null);
  public getUser = this.userData.asObservable();

  constructor() { }

  public setUser(userData: UserData | null){
    this.userData.next(userData)
  }

}
