import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopMixComponent} from './top-mix.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
  {path: '', component: TopMixComponent},
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
export class TopMixRoutingModule {
}
