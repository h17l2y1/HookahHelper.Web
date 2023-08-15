import {Image} from "./image";
import {Tag} from "./tag";

export interface Tobacco {
  id: string;
  name: string;
  description: string;
  brandId: string;
  heavinessId: string;
  lineId: string;
  image: Image;
  tags: Tag[];
}
