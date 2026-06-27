import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopMixComponent} from './top-mix.component';
import {RouterModule, Routes} from "@angular/router";
import {MixViewComponent} from "./mix-view/mix-view.component";

const routes: Routes = [
  {path: '', component: TopMixComponent},
  {path: 'view/:id', component: MixViewComponent},
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [RouterModule]
})
export class TopMixRoutingModule {
}
