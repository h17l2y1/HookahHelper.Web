import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TobaccoListTableComponent} from "./tobacco-table/tobacco-list-table/tobacco-list-table.component";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {TobaccoTableComponent} from "./tobacco-table/tobacco-table.component";

const routes: Routes = [
  // {path: '', component: TobaccoListTableComponent},
  {path: '', component: TobaccoTableComponent},
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatTableModule,
    MatDialogModule,
  ],
  exports: [RouterModule]
})
export class TobaccoRoutingModule {
}
