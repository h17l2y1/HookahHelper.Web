import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private toastr: ToastrService) { }

  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = "Server Error check console";
    }
    this.toastr.error(errorMessage);
  }
}
