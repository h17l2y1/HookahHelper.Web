export interface Review {
  comment: string;
  creationDate: Date;
  isAnonymous: boolean;
  rating: number;
  tobaccoId?: string;
  mixId?: string;
  name: string;
  userId: string;
}
