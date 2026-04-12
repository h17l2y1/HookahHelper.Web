import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'mask' })
export class NamePipe implements PipeTransform {
  transform(value: string) {
    return  value.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }
}
