import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TagTableComponent} from "./tag-table/tag-table.component";
import {TagCreateComponent} from "./tag-create/tag-create.component";
import {TagEditorComponent} from "./tag-editor/tag-editor.component";

const routes: Routes = [
  {path: '', component: TagTableComponent},
  {path: 'create', component: TagCreateComponent},
  {path: 'edit/:id', component: TagEditorComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TagRoutingModule {
}
