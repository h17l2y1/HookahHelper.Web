import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {QueryParams} from "../../interfaces/models/queryParams";

@Injectable()
export class TobaccoQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): QueryParams {
    return {
      name: route.queryParams['name'],
      tagId: route.queryParams['tagId'],
      brandId: route.queryParams['brandId'],
      countryId: route.queryParams['countryId'],
      lineId: route.queryParams['lineId'],
      heavinessId: route.queryParams['heavinessId']
    };
  }
}
