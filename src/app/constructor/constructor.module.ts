import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructorComponent } from './constructor.component';
import {ConstructorRoutingModule} from "./constructor-routing.module";
import {TobaccoService} from "../tobacco/tobacco.service";
import {BrandService} from "../brand/brand.service";
import {SharedModule} from "../shared/shared.module";
import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TopMixService} from "../top-mix/top-mix.service";
import {MatBadgeModule} from "@angular/material/badge";
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
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    PieChartModule,
  ],
  providers: [
    TobaccoService,
    BrandService,
    TopMixService
  ]
})
export class ConstructorModule { }
