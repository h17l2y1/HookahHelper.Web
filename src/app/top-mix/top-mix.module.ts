import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopMixComponent} from './top-mix.component';
import {TopMixRoutingModule} from "./top-mix-routing.module";
import {TopMixService} from "./top-mix.service";
import {HttpClientModule} from "@angular/common/http";
import {StarRatingModule} from "angular-star-rating";
import {ReactiveFormsModule} from "@angular/forms";
import {MixViewComponent} from "./mix-view/mix-view.component";
import {ReviewService} from "../services/review.service";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({
  declarations: [
    TopMixComponent,
    MixViewComponent
  ],
  imports: [
    CommonModule,
    TopMixRoutingModule,
    HttpClientModule,
    StarRatingModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [
    TopMixService,
    ReviewService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopMixModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
