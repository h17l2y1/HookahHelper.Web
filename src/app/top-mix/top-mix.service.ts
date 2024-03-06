import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {QueryParams} from "../interfaces/models/queryParams";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Mix} from "../interfaces/entity/mix";
import {Brand} from "../interfaces/entity/brand";

@Injectable()
export class TopMixService {
  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(queryParams?: QueryParams): Observable<GetAllResponse<Mix>> {
    let req = `Mix/GetAll`
    if (queryParams){
      req = req + '?';
      req = queryParams?.page ? req + `&page=${queryParams.page}` : req;
      req = queryParams?.take ? req + `&take=${queryParams.take}` : req;
      req = queryParams?.sortBy ? req + `&sortBy=${queryParams.sortBy}` : req;
      req = queryParams?.type ? req + `&column=${queryParams.type}` : req;
      req = queryParams?.name ? req + `&name=${queryParams.name}` : req;
    }

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
