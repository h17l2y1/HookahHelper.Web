import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'onlyNumbers',
    standalone: false
})
export class OnlyNumbersPipe implements PipeTransform {
  transform(value: string) {
    return  value.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }
}
