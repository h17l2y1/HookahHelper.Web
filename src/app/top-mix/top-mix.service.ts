import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {QueryParams} from "../interfaces/models/queryParams";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Mix} from "../interfaces/entity/mix";

@Injectable()
export class TopMixService {
  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(page: number, take: number, sortBy: string, type: string, filters: QueryParams): Observable<GetAllResponse<Mix>> {
    let req = `Mix/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}`
    req = filters?.name ? req + `&name=${filters.name}` : req;
    req = filters?.tagId ? req + `&tagId=${filters.tagId}` : req;
    req = filters?.brandId ? req + `&brandId=${filters.brandId}` : req;
    req = filters?.countryId ? req + `&countryId=${filters.countryId}` : req;
    req = filters?.lineId ? req + `&lineId=${filters.lineId}` : req;
    req = filters?.heavinessId ? req + `&heavinessId=${filters.heavinessId}` : req;

    return this.http.get<GetAllResponse<Mix>>(this.rootUrl + req);
  }

  public getById(id: string): Observable<Mix> {
    return this.http.get<Mix>(this.rootUrl + `Mix/GetById/${id}`);
  }

  public create(data: Mix): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Mix/Create', data);
  }

  public update(data: Mix): Observable<void> {
    return this.http.put<void>(this.rootUrl + 'Mix/Update', data);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(this.rootUrl + `Mix/Remove/${id}`);
  }
}
