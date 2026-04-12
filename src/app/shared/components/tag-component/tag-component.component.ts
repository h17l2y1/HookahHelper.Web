import {Component, Input} from '@angular/core';
import {TagType} from "../../../interfaces/enums/tag-type";
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-tag',
    templateUrl: './tag-component.component.html',
    styleUrls: ['./tag-component.component.scss'],
    imports: [NgStyle]
})
export class TagComponentComponent {
  @Input({required: true}) color!: string;
  @Input({required: true}) name!: string;
  @Input({required: true}) type!: TagType;

  public getStyle(): any {
    if (this.type === TagType.Bordered){
      return {
        'border': `2px solid ${this.color}`,
        'color': `${this.color}`,
      }
    }
    return {
      'border': `none`,
      'color': `white`,
      'background-color': `${this.color}`,
    }
  }

}
