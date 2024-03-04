import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {BrandTableComponent} from "./brand-table/brand-table.component";
import {BrandFilterOptionsResolver} from "./brand-filter-options.resolver";
import {BrandQueryParamResolver} from "./brand-query-param.resolver";

const routes: Routes = [
  {
    path: '',
    component: BrandTableComponent,
    resolve: {
      countries: BrandFilterOptionsResolver,
      queryParam: BrandQueryParamResolver
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
export class BrandRoutingModule {
}
