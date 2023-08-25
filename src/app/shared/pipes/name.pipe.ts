import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mask'})
export class NamePipe implements PipeTransform {
  transform(value: string) {
    // return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    // return  value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    return  value.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }
}
