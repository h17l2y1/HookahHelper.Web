import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMixComponent } from './top-mix.component';
import {TopMixRoutingModule} from "./top-mix-routing.module";

@NgModule({
  declarations: [
    TopMixComponent
  ],
  imports: [
    CommonModule,
    TopMixRoutingModule
  ]
})
export class TopMixModule { }
