import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagComponentComponent} from './tag-component.component';

@NgModule({
  declarations: [
    TagComponentComponent
  ],
  exports: [
    TagComponentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TagComponentModule {
}
