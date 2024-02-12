import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";

@Injectable({providedIn: 'root'})
export class UrlIdResolver {
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot): string | null {
    return route.paramMap.get('id');
  }
}
