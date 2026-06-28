export interface Review {
  comment: string;
  creationDate: Date;
  isAnonymous: boolean;
  rating: number;
  sweetness: number;
  sourness: number;
  freshness: number;
  flavorBrightness: number;
  strength: number;
  heatResistance: number;
  smokiness: number;
  tobaccoId?: string;
  mixId?: string;
  name: string;
  userId: string;
}
