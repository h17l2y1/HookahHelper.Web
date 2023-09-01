import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopMixComponent} from './top-mix.component';
import {TopMixRoutingModule} from "./top-mix-routing.module";
import {TopMixService} from "./top-mix.service";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    TopMixComponent
  ],
  imports: [
    CommonModule,
    TopMixRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [
    TopMixService
  ]
})
export class TopMixModule {
}
