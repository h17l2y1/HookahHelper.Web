import {Line} from "./line";
import {Country} from "./country";
import {Image} from "./image";

export interface Brand {
  id: string;
  name: string;
  description: string;
  heavinessId: string;
  country: Country;
  image: Image;
  lines: Array<Line>;
}
