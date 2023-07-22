import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Brand} from "../interfaces/entity/brand";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {CreateBrand} from "../interfaces/other/create-brand";
import {Tobacco} from "../interfaces/entity/tobacco";

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
