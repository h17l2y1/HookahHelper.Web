import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {QueryParams} from "../../interfaces/models/queryParams";

@Injectable()
export class BrandQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): QueryParams {
    const page = route.queryParams['page'];
    return {
      page: page ? page : 0,
      take: route.queryParams['take'],
      sortBy: route.queryParams['sortBy'],
      type: route.queryParams['type'],
      name: route.queryParams['name'],
      countryId: route.queryParams['countryId']
    };
  }
}
