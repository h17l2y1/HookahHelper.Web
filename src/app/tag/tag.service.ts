import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {QueryParams} from "../interfaces/models/queryParams";
import {Observable} from "rxjs";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Tag} from "../interfaces/entity/tag";

@Injectable()
export class TagService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getAll(page: number, take: number, sortBy: string, type: string, filters: QueryParams): Observable<GetAllResponse<Tag>> {
    let req = `Tag/GetAll?Page=${page}&Take=${take}&SortBy=${sortBy}&Column=${type}`
    req = filters?.name ? req + `&name=${filters.name}` : req;

    return this.http.get<GetAllResponse<Tag>>(this.rootUrl + req);
  }

  public getById(id: string): Observable<Tag> {
    return this.http.get<Tag>(this.rootUrl + `Tag/GetById/${id}`);
  }

  public create(data: Tag): Observable<void> {
    return this.http.post<void>(this.rootUrl + 'Tag/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.put<any>(this.rootUrl + 'Tag/Update', data);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(this.rootUrl + `Tag/Remove/${id}`);
  }

  public getOptions(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.rootUrl + 'Tag/GetOptions');
  }

  public getGlobalOptions(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.rootUrl + 'Tag/GetGlobalOptions');
  }
}
