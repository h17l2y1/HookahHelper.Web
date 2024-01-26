import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Review} from "../interfaces/entity/review";

@Injectable()
export class ReviewService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public createReview(request: Review): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Review/Create', request);
  }
}
