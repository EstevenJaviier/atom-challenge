import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFormDate',
  standalone: true,
})
export class FormDatePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    const date = new Date(value._seconds * 1000);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
