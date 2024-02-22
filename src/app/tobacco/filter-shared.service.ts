import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Filter} from "../interfaces/models/filter";

@Injectable()
export class FilterSharedService {
  private filter: Filter = {
    name: null,
    tagId: null,
    brandId: null,
    countryId: null,
    lineId: null,
    heavinessId: null
  }
  private filters = new BehaviorSubject<Filter>(this.filter);
  public getFilters = this.filters.asObservable();

  public setFilters(filter: Filter) {
    this.filters.next(filter)
  }
}
