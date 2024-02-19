import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Filter} from "../interfaces/models/filter";

@Injectable()
export class FilterSharedService {
  private filters = new BehaviorSubject<Filter | null>(null);
  public getFilters = this.filters.asObservable();

  public setFilters(filter: Filter | null){
    this.filters.next(filter)
  }
}
