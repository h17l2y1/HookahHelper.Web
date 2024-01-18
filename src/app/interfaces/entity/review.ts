export interface Review {
  anonymousName: string;
  comment: string;
  creationDate: Date;
  isAnonymous: string;
  rating: number;
  tobaccoId: string;
  user: ReviewUser;
}

interface ReviewUser {
  firstName: string;
  lastName: string;
}
