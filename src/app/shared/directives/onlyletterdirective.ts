import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyletterdirective]',
})
export class Onlyletterdirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.key;

    if (!/^[a-zA-Z\s]$/.test(charCode)) {
      event.preventDefault();
    }
  }
}
