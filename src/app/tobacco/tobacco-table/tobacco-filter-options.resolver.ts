import {inject, Injectable} from "@angular/core";
import {forkJoin, map, Observable} from "rxjs";
import {BrandService} from "../../brand/brand.service";
import {CountryService} from "../../services/country.service";
import {TagService} from "../../tag/tag.service";
import {HeavinessService} from "../../services/heaviness.service";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Tag} from "../../interfaces/entity/tag";
import {Country} from "../../interfaces/entity/country";
import {Brand} from "../../interfaces/entity/brand";
import {TobaccoOptions} from "../../interfaces/models/tobacco-options";

@Injectable()
export class TobaccoFilterOptionsResolver {
  private brandService = inject(BrandService)
  private countryService = inject(CountryService)
  private heavinessService = inject(HeavinessService)
  private tagService = inject(TagService)

  public brands$: Observable<Brand[]> = this.brandService.getOptions();
  public countries$: Observable<Country[]> = this.countryService.getOptions();
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public tags$: Observable<Tag[]> = this.tagService.getGlobalOptions();

  resolve(): Observable<TobaccoOptions> {
    return forkJoin(this.brands$, this.countries$, this.heaviness$, this.tags$)
      .pipe(
        map(([brands, countries, heaviness, tags]) => {
          return {
            brands: brands,
            countries: countries,
            heaviness: heaviness,
            tags: tags,
          } as unknown as TobaccoOptions;
        })
      );
  }

}
