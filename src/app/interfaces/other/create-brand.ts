import {NewLine} from "./new-line";

export interface CreateBrand {
  name: string;
  imageBase64: string;
  lines: Array<NewLine>;
  madeIn: string;
  description: string;
}
