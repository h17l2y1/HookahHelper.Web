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
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {StarRatingModule} from "angular-star-rating";
import {ReactiveFormsModule} from "@angular/forms";
import {MixViewComponent} from "./mix-view/mix-view.component";
import {ReviewService} from "../services/review.service";

@NgModule({
  declarations: [
    TopMixComponent,
    MixViewComponent
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
    MatSortModule,
    MatTableModule,
    MatProgressBarModule,
    StarRatingModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [
    TopMixService,
    ReviewService
  ]
})
export class TopMixModule {
}
