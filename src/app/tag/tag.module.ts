import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagTableComponent} from './tag-table/tag-table.component';
import {TagRoutingModule} from "./tag-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {TagService} from "./tag.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { TagCreateComponent } from './tag-create/tag-create.component';
import {MatDialogModule} from "@angular/material/dialog";
import { TagEditorComponent } from './tag-editor/tag-editor.component';
import {NamePipe} from "../shared/pipes/name.pipe";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    TagTableComponent,
    TagCreateComponent,
    TagEditorComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    MatDialogModule,
    FormsModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  providers: [
    TagService,
    NamePipe
  ]
})
export class TagModule {
}
