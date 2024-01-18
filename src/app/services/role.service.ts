import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private role = new BehaviorSubject(false);
  public isAdmin = this.role.asObservable();

  constructor() { }

  public setAdminRole(isAdmin: boolean){
    this.role.next(isAdmin)
  }

}
