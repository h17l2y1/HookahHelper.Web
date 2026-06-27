import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageUploadComponent} from "./image-upload.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {FormsModule} from "@angular/forms";
import {NgxFileDropModule} from "ngx-file-drop";
import {DndDirective} from "./dnd.directive";

@NgModule({
  declarations: [
    ImageUploadComponent,
    DndDirective
  ],
  exports: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    FormsModule,
    NgxFileDropModule
  ]
})
export class ImageUploadModule {
}
