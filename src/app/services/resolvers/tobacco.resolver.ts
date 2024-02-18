import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {TobaccoService} from "../../tobacco/tobacco.service";
import {Observable} from "rxjs";
import {Tobacco} from "../../interfaces/entity/tobacco";

@Injectable({providedIn: 'root'})
export class TobaccoResolver {
  private tobaccoService = inject(TobaccoService)

  resolve(route: ActivatedRouteSnapshot): Observable<Tobacco> | null {
    const id = route.paramMap.get('id');
    if (id){
      return this.tobaccoService.getById(id);
    }

    return null
  }

}
