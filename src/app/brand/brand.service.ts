import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Brand} from "../interfaces/entity/brand";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {CreateBrand} from "../interfaces/other/create-brand";

@Injectable()
export class BrandService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(page: number, take: number, sortBy: string, type: string, filterBy?: string): Observable<GetAllResponse<Brand>> {
    if (filterBy){
      return this.http.get<GetAllResponse<Brand>>(this.rootUrl + `Brand/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}&filterBy=${filterBy}`);
    }

    return this.http.get<GetAllResponse<Brand>>(this.rootUrl + `Brand/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}`);
  }

  public create(data: CreateBrand): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Brand/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Brand/Update', data);
  }

  public remove(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Brand/Remove', data);
  }
}
