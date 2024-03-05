import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {QueryParams} from "../../interfaces/models/queryParams";

@Injectable()
export class TobaccoQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): QueryParams {
    const page = route.queryParams['page'];
    return {
      page: page ? page : 0,
      take: route.queryParams['take'],
      sortBy: route.queryParams['sortBy'],
      type: route.queryParams['type'],
      name: route.queryParams['name'],
      tagId: route.queryParams['tagId'],
      brandId: route.queryParams['brandId'],
      countryId: route.queryParams['countryId'],
      lineId: route.queryParams['lineId'],
      heavinessId: route.queryParams['heavinessId']
    };
  }
}
