import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {BrandTableComponent} from "./brand-table/brand-table.component";

const routes: Routes = [
  {
    path: '', component: BrandTableComponent
  },
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
export class BrandRoutingModule {
}
