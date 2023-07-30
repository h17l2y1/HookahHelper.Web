import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageUploadComponent} from "./components/image-upload/image-upload.component";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {ImageCropperModule} from "ngx-image-cropper";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    ImageUploadComponent,
    ConfirmationPopupComponent
  ],
  providers:[],
    imports: [
        CommonModule,
        HttpClientModule,
        MatInputModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatDialogModule,
        MatButtonModule,
        ImageCropperModule,
        FormsModule,
        MatCardModule
    ],
  exports: [
    ImageUploadComponent,
    ConfirmationPopupComponent
  ]
})
export class SharedModule {
}
