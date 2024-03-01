import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrandRoutingModule} from "./brand-routing.module";
import {BrandTableComponent} from './brand-table/brand-table.component';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {BrandEditorComponent} from './brand-editor/brand-editor.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {BrandService} from "./brand.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {CountryService} from "../services/country.service";
import {BrandCreateComponent} from './brand-create/brand-create.component';
import {NamePipe} from "../shared/pipes/name.pipe";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {BrandCardsComponent} from './brand-table/brand-cards/brand-cards.component';
import {BrandListComponent} from './brand-table/brand-list/brand-list.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CountrySelectModule} from "../shared/components/country-select/country-select.module";
import {MatCardModule} from "@angular/material/card";
import {StarRatingModule} from "angular-star-rating";
import {ImageUploadModule} from "../shared/components/image-upload/image-upload.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {BrandFilterOptionsResolver} from "./brand-table/brand-filter-options.resolver";
import {BrandQueryParamResolver} from "./brand-table/brand-query-param.resolver";

@NgModule({
  declarations: [
    BrandTableComponent,
    BrandEditorComponent,
    BrandCreateComponent,
    BrandCardsComponent,
    BrandListComponent,
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    CountrySelectModule,
    MatCardModule,
    StarRatingModule,
    ImageUploadModule,
    MatExpansionModule
  ],
  providers: [
    BrandService,
    CountryService,
    NamePipe,
    BrandFilterOptionsResolver,
    BrandQueryParamResolver,
  ]
})
export class BrandModule {
}
