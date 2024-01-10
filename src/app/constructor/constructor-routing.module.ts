import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ConstructorComponent} from "./constructor.component";

const routes: Routes = [
  {path: '', component: ConstructorComponent},
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [RouterModule]
})
export class ConstructorRoutingModule {
}
