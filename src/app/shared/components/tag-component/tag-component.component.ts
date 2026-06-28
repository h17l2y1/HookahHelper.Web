import {Component, Input} from '@angular/core';
import {TagType} from "../../../interfaces/enums/tag-type";

@Component({
  selector: 'app-tag',
  templateUrl: './tag-component.component.html',
  styleUrls: ['./tag-component.component.scss']
})
export class TagComponentComponent {
  @Input({required: true}) color!: string;
  @Input({required: true}) name!: string;
  @Input({required: true}) type!: TagType;

  public getStyle(): any {
    const rgb = this.hexToRgb(this.color);
    const backgroundOpacity = this.type === TagType.Filled ? 0.22 : 0.14;
    const borderOpacity = this.type === TagType.Filled ? 0.34 : 0.24;

    return {
      'border': `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
      'color': `${this.color}`,
      'background-color': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`,
      'box-shadow': `inset 0 0 0 1px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.type === TagType.Filled ? 0.08 : 0.04})`,
    }
  }

  private hexToRgb(color: string): {r: number; g: number; b: number} {
    const fallback = {r: 255, g: 255, b: 255};
    const normalized = String(color ?? '').trim();
    if (!normalized) {
      return fallback;
    }

    const hex = normalized.replace('#', '');
    const expanded = hex.length === 3
      ? hex.split('').map(ch => ch + ch).join('')
      : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
      return fallback;
    }

    const value = parseInt(expanded, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

}
