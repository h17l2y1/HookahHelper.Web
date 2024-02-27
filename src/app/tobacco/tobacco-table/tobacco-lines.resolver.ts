import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ActivatedRouteSnapshot} from "@angular/router";
import {LineService} from "../../services/line.service";
import {Line} from "../../interfaces/entity/line";

@Injectable()
export class TobaccoLinesResolver {
  private lineService = inject(LineService);

  resolve(route: ActivatedRouteSnapshot): Observable<Line[] | null> {
    const brandId = route.queryParams['brandId'];
    if (brandId){
      return this.lineService.getLinesByBrandId(brandId);
    }
    return of(null);
  }
}
