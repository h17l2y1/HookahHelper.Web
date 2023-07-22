import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageUploadComponent} from "./components/image-upload/image-upload.component";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  providers:[],
  imports: [
    CommonModule,
    HttpClientModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressBarModule,
  ],
  exports: [
    ImageUploadComponent
  ]
})
export class SharedModule {
}
