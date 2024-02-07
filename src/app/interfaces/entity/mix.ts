import {TobaccoMix} from "./tobacco-mix";
import {Review} from "./review";

export interface Mix {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  commentsCount: number;
  tobaccoMixes: TobaccoMix[];
  reviews: Review[];
}
