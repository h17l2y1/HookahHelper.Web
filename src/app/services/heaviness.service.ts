import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {Heaviness} from "../interfaces/entity/heaviness";

@Injectable()
export class HeavinessService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getOptions(): Observable<Heaviness[]> {
    return this.http.get<Heaviness[]>(this.rootUrl + `Heaviness/GetOptions`);
  }
}
