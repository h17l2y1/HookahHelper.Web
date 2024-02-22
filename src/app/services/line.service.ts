import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Line} from "../interfaces/entity/line";

@Injectable()
export class LineService {

  readonly rootUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getLinesByBrandId(id?: string | null): Observable<Line[]> {
    return this.http.get<Line[]>(this.rootUrl + `Line/GetLinesByBrandId/${id}`);
  }

  public getOptions(): Observable<Line[]> {
    return this.http.get<Line[]>(this.rootUrl + `Line/GetOptions`);
  }
}
