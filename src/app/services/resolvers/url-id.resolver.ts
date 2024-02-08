import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

@Injectable({providedIn: 'root'})
export class UrlIdResolver implements Resolve<string | null> {
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | null {
    return route.paramMap.get('id');
  }
}
