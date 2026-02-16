
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appCapitalizeInput]'
})
export class CapitalizeInputDirective {

    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event: any) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        if (!value) return;

        // Capitalize first letter of each word
        const capitalized = value.replace(/\b\w/g, first => first.toLocaleUpperCase());

        if (value !== capitalized) {
            this.control.control?.setValue(capitalized, { emitEvent: false });
            input.value = capitalized;
        }
    }
}
