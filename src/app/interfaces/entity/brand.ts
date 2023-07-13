import {Line} from "./line";
import {Country} from "./country";

export interface Brand {
  id: string;
  name: string;
  description: string;
  country: Country;
  image64: string;
  lines: Array<Line>;
}
