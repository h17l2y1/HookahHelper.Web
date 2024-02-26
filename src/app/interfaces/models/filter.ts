import {Brand} from "../entity/brand";
import {Country} from "../entity/country";
import {Line} from "../entity/line";
import {Heaviness} from "../entity/heaviness";
import {Tag} from "../entity/tag";

export interface Filter {
  name?: string | null;
  brand?: Brand | null;
  country?: Country | null;
  line?: Line | null;
  heaviness?: Heaviness | null;
  tag?: Tag | null;
}
