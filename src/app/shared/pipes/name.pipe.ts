import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'mask',
    standalone: false
})
export class NamePipe implements PipeTransform {
  transform(value: string) {
    return  value.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }
}
