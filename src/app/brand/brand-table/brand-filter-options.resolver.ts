import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CountryService} from "../../services/country.service";
import {Country} from "../../interfaces/entity/country";

@Injectable()
export class BrandFilterOptionsResolver {
  private countryService = inject(CountryService)

  resolve(): Observable<Country[]> {
    return this.countryService.getOptions();
  }

}
