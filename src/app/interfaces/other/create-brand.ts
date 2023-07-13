import {NewLine} from "./new-line";

export interface CreateBrand {
  imageBase64: string;
  name: string;
  description: string;
  countryId: string;
  lines: Array<NewLine>;

}
