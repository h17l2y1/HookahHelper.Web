import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {QueryParams} from "../interfaces/models/queryParams";

@Injectable()
export class TopMixQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): QueryParams {
    const page = route.queryParams['page'];
    return {
      page: page ? page : 0,
      take: route.queryParams['take'],
      sortBy: route.queryParams['sortBy'],
      type: route.queryParams['type'],
      name: route.queryParams['name'],
    };
  }
}
