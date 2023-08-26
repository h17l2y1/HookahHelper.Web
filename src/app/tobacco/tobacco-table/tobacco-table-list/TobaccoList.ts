import {Tobacco} from "../../../interfaces/entity/tobacco";
import {Tag} from "../../../interfaces/entity/tag";

export interface TobaccoList extends Tobacco {
  tagsDefault: Tag[];
  tagsGlobal: Tag[];
}
