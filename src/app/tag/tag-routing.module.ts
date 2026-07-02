import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TagTableComponent} from "./tag-table/tag-table.component";

const routes: Routes = [
  {path: '', component: TagTableComponent},
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
