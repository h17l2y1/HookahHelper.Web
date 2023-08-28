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
import {MatLegacyAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatLegacyOptionModule} from "@angular/material/legacy-core";

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
        MatLegacyAutocompleteModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
        MatLegacyOptionModule
    ],
  providers: [
    TobaccoService,
    BrandService,
  ]
})
export class ConstructorModule { }
