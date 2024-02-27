import {Brand} from "../entity/brand";
import {Country} from "../entity/country";
import {Line} from "../entity/line";
import {Heaviness} from "../entity/heaviness";
import {Tag} from "../entity/tag";

export interface Filter {
  name?: string | null;
  tagId?: string | null;
  brandId?: string | null;
  countryId?: string | null;
  lineId?: string | null;
  heavinessId?: string | null;
}
