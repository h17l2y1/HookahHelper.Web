import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QueryParams} from "../interfaces/models/queryParams";

@Injectable()
export class FilterSharedService {
  private filter: QueryParams = {
    name: null,
    tagId: null,
    brandId: null,
    countryId: null,
    lineId: null,
    heavinessId: null
  }
  private filters = new BehaviorSubject<QueryParams>(this.filter);
  public getFilters = this.filters.asObservable();

  public setFilters(filter: QueryParams) {
    this.filters.next(filter)
  }
}
