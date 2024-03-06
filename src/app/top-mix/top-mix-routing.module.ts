import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopMixComponent} from './top-mix.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {TopMixQueryParamResolver} from "./top-mix-query-param.resolver";

const routes: Routes = [
  {
    path: '',
    component: TopMixComponent,
    resolve: {
      queryParam: TopMixQueryParamResolver
    }
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
export class TopMixRoutingModule {
}
