import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag-component.component.html',
  styleUrls: ['./tag-component.component.scss']
})
export class TagComponentComponent {
  @Input({required: true}) color!: string;
  @Input({required: true}) name!: string;
  @Input() isBordered?: boolean = true;

  constructor() {
  }

  public getBorder(color: string): string {
    return `2px solid ${color}`;
  }

  public getColor(): string {
    return this.color;
  }

}
