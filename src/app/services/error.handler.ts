import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private toastr: ToastrService) {
  }

  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // 40X error
      errorMessage = `${err.status}: ${err}`;
    } else {
      // 50X error
      errorMessage = err.error;
    }
    this.toastr.error(errorMessage);
  }
}
