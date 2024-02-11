import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpRequest, HttpResponse} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ConfirmHandler {

  constructor(private toastr: ToastrService) {
  }

  public handleConfirm(req: HttpRequest<any>) {
    let message: string = "";

    // if (req.method) {
    //   message = (req.method as any).title;
    //   this.toastr.success(message);
    //   return;
    // }

    switch(req.method) {
      case 'POST': message = 'Creation successful'; break;
      case 'PUT': message = 'Update successful'; break;
      case 'DELETE': message = 'Delete successful'; break;
      default: break;
    }
    if (req.method !== 'GET')
    this.toastr.success(message);
  }

}
