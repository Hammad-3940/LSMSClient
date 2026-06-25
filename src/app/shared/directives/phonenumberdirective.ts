import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhonenumber]',
})
export class Phonenumberdirective {
  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

    let value = this.el.nativeElement.value;

    // Remove everything except digits
    value = value.replace(/\D/g, '');

    // Limit total digits if required (11 for Pakistani mobile)
    value = value.substring(0, 11);

    // Add hyphen after first 4 digits
    if (value.length > 4) {
      value = value.substring(0, 4) + '-' + value.substring(4);
    }

    this.el.nativeElement.value = value;

    // Trigger input event so Angular FormControl updates
    this.el.nativeElement.dispatchEvent(
      new Event('input', { bubbles: true })
    );
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
