import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Tobacco} from "../interfaces/entity/tobacco";

@Injectable()
export class TobaccoService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(page: number, take: number, sortBy: string, type: string, filterBy?: string): Observable<GetAllResponse<Tobacco>> {
    if (filterBy){
      return this.http.get<GetAllResponse<Tobacco>>(this.rootUrl + `Tobacco/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}&filterBy=${filterBy}`);
    }

    return this.http.get<GetAllResponse<Tobacco>>(this.rootUrl + `Tobacco/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}`);
  }

  public create(data: Tobacco): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Tobacco/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Tobacco/Update', data);
  }

  public remove(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Tobacco/Remove', data);
  }
}
