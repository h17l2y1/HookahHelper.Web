import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Country} from "../interfaces/entity/country";

@Injectable()
export class CountryService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getOptions(): Observable<Country[]> {
    return this.http.get<Country[]>(this.rootUrl + 'Country/GetOptions');
  }

}
