import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountrySelectComponent } from './country-select.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    CountrySelectComponent
  ],
  exports: [
    CountrySelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class CountrySelectModule { }
