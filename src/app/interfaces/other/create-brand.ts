import {NewLine} from "./new-line";
import {Image} from "../entity/image";

export interface CreateBrand {
  image: Image;
  name: string;
  description: string;
  countryId: string;
  lines?: Array<NewLine>;
}
