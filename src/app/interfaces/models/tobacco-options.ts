import {Country} from "../entity/country";
import {Heaviness} from "../entity/heaviness";
import {Tag} from "../entity/tag";
import {Brand} from "../entity/brand";

export interface TobaccoOptions {
  brands: Brand[];
  countries: Country[];
  heaviness: Heaviness[];
  tags: Tag[];
}
