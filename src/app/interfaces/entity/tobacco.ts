import {Line} from "./line";
import {Image} from "./image";


export interface Tobacco {
  id: string;
  name: string;
  description: string;
  // sweetness: number;
  // acidity: number;
  // spice: number;
  // freshness: number;
  // rating: number;
  // taste: number;
  // fortress: number;
  // smokiness: number;
  brandId: string;
  heavinessId: string;
  lineId: string;
  image: Image;
}
