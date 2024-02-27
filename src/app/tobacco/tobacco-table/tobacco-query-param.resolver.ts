import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {Filter} from "../../interfaces/models/filter";

@Injectable()
export class TobaccoQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): Filter {
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
