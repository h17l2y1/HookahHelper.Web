import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BrandRoutingModule} from "./brand-routing.module";
import {BrandTableComponent} from './brand-table/brand-table.component';
import {ReactiveFormsModule} from "@angular/forms";
import {BrandEditorComponent} from './brand-editor/brand-editor.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {BrandService} from "./brand.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {CountryService} from "../services/country.service";
import {BrandCreateComponent} from './brand-create/brand-create.component';
import {NamePipe} from "../shared/pipes/name.pipe";
import {CountrySelectModule} from "../shared/components/country-select/country-select.module";
import {MatCardModule} from "@angular/material/card";
import {StarRatingModule} from "angular-star-rating";
import {ImageUploadModule} from "../shared/components/image-upload/image-upload.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {BrandFilterOptionsResolver} from "./brand-filter-options.resolver";
import {BrandQueryParamResolver} from "./brand-query-param.resolver";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {defineElement} from "@lordicon/element";
import lottie from "lottie-web";

@NgModule({
  declarations: [
    BrandTableComponent,
    BrandEditorComponent,
    BrandCreateComponent,
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    CountrySelectModule,
    MatCardModule,
    StarRatingModule,
    ImageUploadModule,
    MatExpansionModule,
    NgxSkeletonLoaderModule,
    NgOptimizedImage
  ],
  providers: [
    BrandService,
    CountryService,
    NamePipe,
    BrandFilterOptionsResolver,
    BrandQueryParamResolver
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
