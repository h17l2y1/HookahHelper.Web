import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Brand} from "../interfaces/entity/brand";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {CreateBrand} from "../interfaces/other/create-brand";
import {QueryParams} from "../interfaces/models/queryParams";

@Injectable()
export class BrandService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(queryParams?: QueryParams): Observable<GetAllResponse<Brand>> {
    let req = `Brand/GetAll`
    if (queryParams){
      req = req + '?';
      req = queryParams?.page ? req + `&page=${queryParams.page}` : req;
      req = queryParams?.take ? req + `&take=${queryParams.take}` : req;
      req = queryParams?.sortBy ? req + `&sortBy=${queryParams.sortBy}` : req;
      req = queryParams?.type ? req + `&column=${queryParams.type}` : req;
      req = queryParams?.name ? req + `&name=${queryParams.name}` : req;
      req = queryParams?.countryId ? req + `&countryId=${queryParams.countryId}` : req;
    }

    return this.http.get<GetAllResponse<Brand>>(this.rootUrl + req);
  }

  public getOptions(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.rootUrl + 'Brand/GetOptions');
  }

  public getById(id: string): Observable<Brand> {
    return this.http.get<Brand>(this.rootUrl + `Brand/GetById/${id}`);
  }

  public create(data: CreateBrand): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Brand/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.put<any>(this.rootUrl + 'Brand/Update', data);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(this.rootUrl + `Brand/Remove/${id}`);
  }
}
