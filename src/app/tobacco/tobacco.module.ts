import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TobaccoCreateComponent} from './tobacco-create/tobacco-create.component';
import {TobaccoRoutingModule} from "./tobacco-routing.module";
import {TobaccoService} from "./tobacco.service";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {BrandService} from "../brand/brand.service";
import {CountryService} from "../services/country.service";
import {TobaccoEditorComponent} from './tobacco-editor/tobacco-editor.component';
import {LineService} from "../services/line.service";
import {HeavinessService} from "../services/heaviness.service";
import {TobaccoTableComponent} from "./tobacco-table/tobacco-table.component";
import {NamePipe} from "../shared/pipes/name.pipe";
import {TagService} from "../tag/tag.service";
import {StarRatingModule} from "angular-star-rating";
import {ReviewService} from "../services/review.service";
import {ImageUploadModule} from "../shared/components/image-upload/image-upload.module";
import {TagComponentModule} from "../shared/components/tag-component/tag-component.module";
import {TobaccoViewPageComponent} from './tobacco-table/tobacco-view-page/tobacco-view-page.component';
import {TobaccoResolver} from "../services/resolvers/tobacco.resolver";
import {CountrySelectModule} from "../shared/components/country-select/country-select.module";
import {FilterSharedService} from "./filter-shared.service";
import {TobaccoFilterOptionsResolver} from "./tobacco-table/tobacco-filter-options.resolver";
import {TobaccoQueryParamResolver} from "./tobacco-table/tobacco-query-param.resolver";
import {TobaccoLinesResolver} from "./tobacco-table/tobacco-lines.resolver";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({
  declarations: [
    TobaccoCreateComponent,
    TobaccoEditorComponent,
    TobaccoTableComponent,
    TobaccoViewPageComponent,
  ],
  imports: [
    CommonModule,
    TobaccoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    StarRatingModule.forRoot(),
    ImageUploadModule,
    TagComponentModule,
    CountrySelectModule,
    NgxSkeletonLoaderModule,
    NgOptimizedImage
  ],
  providers: [
    TobaccoService,
    BrandService,
    CountryService,
    LineService,
    HeavinessService,
    NamePipe,
    TagService,
    ReviewService,
    TobaccoResolver,
    TobaccoFilterOptionsResolver,
    TobaccoQueryParamResolver,
    TobaccoLinesResolver,
    FilterSharedService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TobaccoModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
