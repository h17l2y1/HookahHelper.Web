import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandRoutingModule} from "./brand-routing.module";
import {BrandTableComponent} from './brand-table/brand-table.component';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {BrandCreateComponent} from './brand-create/brand-create.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {AppModule} from "../app.module";
import {ImageUploadComponent} from "../shared/components/image-upload/image-upload.component";
import {SharedModule} from "../shared/shared.module";
import {BrandService} from "./brand.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    BrandTableComponent,
    BrandCreateComponent,
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    BrandService
  ]
})
export class BrandModule {
}
