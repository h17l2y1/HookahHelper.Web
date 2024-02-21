import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {TobaccoTableComponent} from "./tobacco-table/tobacco-table.component";
import {UrlIdResolver} from "../services/resolvers/url-id.resolver";
import {TobaccoViewPageComponent} from "./tobacco-table/tobacco-view-page/tobacco-view-page.component";
import {TobaccoResolver} from "../services/resolvers/tobacco.resolver";

const routes: Routes = [
  {
    path: '', component: TobaccoTableComponent
  },
  {
    path: ':id', component: TobaccoTableComponent, resolve: {brandId: UrlIdResolver}
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
