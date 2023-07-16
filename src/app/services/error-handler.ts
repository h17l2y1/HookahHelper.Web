import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: Error | HttpErrorResponse) {
    // const errorService = this.injector.get(ErrorService);
    const notifier = this.injector.get(ToastrService);

    let message;
    let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      // message = errorService.getServerErrorMessage(error);
      //stackTrace = errorService.getServerErrorStackTrace(error);
      // notifier.error(error.message);
      // notifier.error('Server error');
    } else {
      // Client Error
      // message = errorService.getClientErrorMessage(error);
      // notifier.error(error.message);
      // notifier.error('Client Error');
    }
    // logger.logError(message, stackTrace);
    // console.error(error);
  }
}
