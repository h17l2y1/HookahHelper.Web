import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Filter} from "../interfaces/models/filter";

@Injectable()
export class FilterSharedService {
  private filter: Filter = {
    name: null,
    tag: null,
    brand: null,
    country: null,
    line: null,
    heaviness: null
  }
  private filters = new BehaviorSubject<Filter>(this.filter);
  public getFilters = this.filters.asObservable();

  public setFilters(filter: Filter) {
    this.filters.next(filter)
  }
}
