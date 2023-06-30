import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable()
export class BrandService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get<any>(this.rootUrl + 'Brand/GetAll');
  }

  public create(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Brand/Create', data);
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Brand/Update', data);
  }

  public remove(data: any): Observable<any> {
    return this.http.post<any>(this.rootUrl + 'Brand/Remove', data);
  }
}
