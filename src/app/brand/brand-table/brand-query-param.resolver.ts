import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {Filter} from "../../interfaces/models/filter";

@Injectable()
export class BrandQueryParamResolver {

  resolve(route: ActivatedRouteSnapshot): Filter {
    return {
      name: route.queryParams['name'],
      countryId: route.queryParams['countryId']
    };
  }
}
