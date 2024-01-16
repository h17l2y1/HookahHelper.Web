import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandRoutingModule} from "./brand-routing.module";
import {BrandTableComponent} from './brand-table/brand-table.component';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {BrandEditorComponent} from './brand-editor/brand-editor.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {BrandService} from "./brand.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {CountryService} from "../services/country.service";
import {BrandCreateComponent} from './brand-create/brand-create.component';
import {NamePipe} from "../shared/pipes/name.pipe";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    BrandTableComponent,
    BrandEditorComponent,
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
    MatProgressBarModule,
  ],
  providers: [
    BrandService,
    CountryService,
    NamePipe
  ]
})
export class BrandModule {
}
