import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NamePipe} from "./pipes/name.pipe";
import {OnlyNumbersPipe} from './pipes/only-numbers.pipe';

@NgModule({
  declarations: [
    NamePipe,
    OnlyNumbersPipe
  ],
  providers: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [
    NamePipe,
    OnlyNumbersPipe
  ]
})
export class SharedModule {
}
