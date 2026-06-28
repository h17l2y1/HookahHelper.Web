import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {BrandTableComponent} from "./brand-table/brand-table.component";
import {BrandCreateComponent} from "./brand-create/brand-create.component";
import {BrandEditorComponent} from "./brand-editor/brand-editor.component";
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
  {
    path: 'create',
    component: BrandCreateComponent
  },
  {
    path: 'edit/:id',
    component: BrandEditorComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [RouterModule]
})
export class BrandRoutingModule {
}
