import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../interfaces/entity/tag";

@Injectable()
export class TagService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getOptions(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.rootUrl + 'Tag/GetOptions');
  }
}
