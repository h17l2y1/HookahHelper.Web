import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Tobacco} from "../interfaces/entity/tobacco";
import {Filter} from "../interfaces/models/filter";

@Injectable()
export class TobaccoService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(page: number, take: number, sortBy: string, type: string, filters: Filter): Observable<GetAllResponse<Tobacco>> {
    let req = `Tobacco/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}`
    req = filters?.name ? req + `&name=${filters.name}` : req;
    req = filters?.tagId ? req + `&tagId=${filters.tagId}` : req;
    req = filters?.brandId ? req + `&brandId=${filters.brandId}` : req;
    req = filters?.countryId ? req + `&countryId=${filters.countryId}` : req;
    req = filters?.lineId ? req + `&lineId=${filters.lineId}` : req;
    req = filters?.heavinessId ? req + `&heavinessId=${filters.heavinessId}` : req;

    return this.http.get<GetAllResponse<Tobacco>>(this.rootUrl + req);
  }

  public getById(id: string): Observable<Tobacco> {
    return this.http.get<Tobacco>(this.rootUrl + `Tobacco/GetById/${id}`);
  }

  public create(data: Tobacco): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Tobacco/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.put<any>(this.rootUrl + 'Tobacco/Update', data);
  }

  public remove(id: any): Observable<any> {
    return this.http.delete<void>(this.rootUrl + `Tobacco/Remove/${id}`);
  }
}
