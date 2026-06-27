import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructorComponent } from './constructor.component';
import {ConstructorRoutingModule} from "./constructor-routing.module";
import {TobaccoService} from "../tobacco/tobacco.service";
import {BrandService} from "../brand/brand.service";
import {SharedModule} from "../shared/shared.module";
import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TopMixService} from "../top-mix/top-mix.service";
import {PieChartModule} from "@swimlane/ngx-charts";

@NgModule({
  declarations: [
    ConstructorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ConstructorRoutingModule,
    CdkDropList,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    PieChartModule,
  ],
  providers: [
    TobaccoService,
    BrandService,
    TopMixService
  ]
})
export class ConstructorModule { }
