import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {TagTableComponent} from "./tag-table/tag-table.component";

const routes: Routes = [
  {path: '', component: TagTableComponent},
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatTableModule,
    MatDialogModule
  ],
  exports: [RouterModule]
})
export class TagRoutingModule {
}
