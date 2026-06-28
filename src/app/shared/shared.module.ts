import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NamePipe} from "./pipes/name.pipe";
import {OnlyNumbersPipe} from './pipes/only-numbers.pipe';
import {ReactiveFormsModule} from "@angular/forms";
import {SearchSelectComponent} from "./components/search-select/search-select.component";
import {TokenPickerComponent} from "./components/token-picker/token-picker.component";

@NgModule({
  declarations: [
    NamePipe,
    OnlyNumbersPipe,
    SearchSelectComponent,
    TokenPickerComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NamePipe,
    OnlyNumbersPipe,
    SearchSelectComponent,
    TokenPickerComponent,
  ]
})
export class SharedModule {
}
