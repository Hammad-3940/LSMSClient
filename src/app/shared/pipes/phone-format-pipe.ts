import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length <= 4) {
      return digits;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
}
