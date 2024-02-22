import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {TobaccoTableComponent} from "./tobacco-table/tobacco-table.component";
import {UrlIdResolver} from "../services/resolvers/url-id.resolver";
import {TobaccoViewPageComponent} from "./tobacco-table/tobacco-view-page/tobacco-view-page.component";
import {TobaccoResolver} from "../services/resolvers/tobacco.resolver";
import {TobaccoFilterOptionsResolver} from "./tobacco-table/tobacco-filter-options.resolver";

const routes: Routes = [
  {
    path: '', component: TobaccoTableComponent,
    resolve: {
      options: TobaccoFilterOptionsResolver,
    }
  },
  {
    path: ':id',
    component: TobaccoTableComponent,
    resolve: {
      brandId: UrlIdResolver,
      options: TobaccoFilterOptionsResolver,
    }
  },
  {
    path: 'tobacco/:id', component: TobaccoViewPageComponent, resolve: {tobacco: TobaccoResolver}
  },
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
