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
      errorMessage = (err.error as any).title;
      this.toastr.error(errorMessage);
      return;
    }

    switch(err.status) {
      case 0: errorMessage = 'Server is down'; break;
      case 400: errorMessage = 'Bad Request'; break;
      case 401: errorMessage = 'Unauthorized'; break;
      case 403: errorMessage = 'Forbidden'; break;
      case 404: errorMessage = 'Not Found'; break;
      case 405: errorMessage = 'Method Not Allowed'; break;
      case 500: errorMessage = 'Internal Server Error'; break;
      case 502: errorMessage = 'Bad Gateway'; break;
      case 503: errorMessage = 'Service Unavailable'; break;
      default: errorMessage = 'Some Error'; break;
    }

    this.toastr.error(errorMessage);
  }

}
