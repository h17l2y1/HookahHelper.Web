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
    ReactiveFormsModule
  ],
  providers: [
    TobaccoService,
    BrandService,
  ]
})
export class ConstructorModule { }
