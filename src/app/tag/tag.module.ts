import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagTableComponent} from './tag-table/tag-table.component';
import {TagRoutingModule} from "./tag-routing.module";
import {TagService} from "./tag.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {TagCreateComponent} from './tag-create/tag-create.component';
import {TagEditorComponent} from './tag-editor/tag-editor.component';
import {NamePipe} from "../shared/pipes/name.pipe";
import {TagComponentModule} from "../shared/components/tag-component/tag-component.module";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({
  declarations: [
    TagTableComponent,
    TagCreateComponent,
    TagEditorComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TagComponentModule
  ],
  providers: [
    TagService,
    NamePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
