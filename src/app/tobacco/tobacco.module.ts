import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TobaccoCreateComponent} from './tobacco-create/tobacco-create.component';
import {TobaccoRoutingModule} from "./tobacco-routing.module";
import {TobaccoTableCardComponent} from './tobacco-table/tobacco-table-card/tobacco-table-card.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {TobaccoService} from "./tobacco.service";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatCardModule} from "@angular/material/card";
import {BrandService} from "../brand/brand.service";
import {CountryService} from "../services/country.service";
import {TobaccoEditorComponent} from './tobacco-editor/tobacco-editor.component';
import {LineService} from "../services/line.service";
import {HeavinessService} from "../services/heaviness.service";
import {MatBadgeModule} from "@angular/material/badge";
import {TobaccoTableListComponent} from './tobacco-table/tobacco-table-list/tobacco-table-list.component';
import {TobaccoTableComponent} from "./tobacco-table/tobacco-table.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {NamePipe} from "../shared/pipes/name.pipe";
import {TagService} from "../tag/tag.service";
import {StarRatingModule} from "angular-star-rating";
import {ReviewService} from "../services/review.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ImageUploadModule} from "../shared/components/image-upload/image-upload.module";
import {TagComponentModule} from "../shared/components/tag-component/tag-component.module";
import {TobaccoViewPageComponent} from './tobacco-table/tobacco-view-page/tobacco-view-page.component';
import {TobaccoResolver} from "../services/resolvers/tobacco.resolver";
import {CountrySelectModule} from "../shared/components/country-select/country-select.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {FilterSharedService} from "./filter-shared.service";

@NgModule({
  declarations: [
    TobaccoCreateComponent,
    TobaccoEditorComponent,
    TobaccoTableCardComponent,
    TobaccoTableListComponent,
    TobaccoTableComponent,
    TobaccoViewPageComponent,
  ],
  imports: [
    CommonModule,
    TobaccoRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    StarRatingModule.forRoot(),
    MatProgressBarModule,
    ImageUploadModule,
    TagComponentModule,
    CountrySelectModule,
    MatExpansionModule,
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
    FilterSharedService,
  ]
})
export class TobaccoModule {
}
