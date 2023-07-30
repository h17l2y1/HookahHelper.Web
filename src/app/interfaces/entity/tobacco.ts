import {Line} from "./line";
import {Image} from "./image";

export interface Tobacco {
  id: string;
  name: string;
  description: string;
  brandId: string;
  line: Line;
  image: Image;
}
