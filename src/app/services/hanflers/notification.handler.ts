import {ErrorHandler, Injectable} from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotificationHandler {

  constructor(private toastr: ToastrService) {
  }

  public handleConfirm(req: HttpRequest<any>) {
    if(req.url.includes('Account')){
      return;
    }


    switch(req.method) {
      case 'POST': this.sendNotification('Creation successful'); break;
      case 'PUT': this.sendNotification('Update successful'); break;
      case 'DELETE': this.sendNotification('Delete successful'); break;
      default: break;
    }
  }

  private sendNotification(message: string): void{
    this.toastr.success(message);
  }

}
