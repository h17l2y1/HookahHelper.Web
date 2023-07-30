import {Line} from "./line";
import {Image} from "./image";

export interface Tobacco {
  id: string;
  name: string;
  description: string;
  brandId: string;
  heavinessId: string;
  lineId: string;
  image: Image;
}
