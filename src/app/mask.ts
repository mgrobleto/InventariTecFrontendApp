import {Directive,HostListener, OnInit} from '@angular/core'

@Directive({
selector: '[mobMask]'
})

export class MobDirective implements OnInit {
    
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    @HostListener('input', ['$event'])

    onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\s+/g, '');

    if (trimmed.length > 8) {
    trimmed = trimmed.substr(0, 8);
    }


    trimmed = trimmed.replace(/-/g,'');

    let numbers = [];
    
    numbers.push(trimmed.substr(0,4));

    if(trimmed.substr(3,2)!=="")
    numbers.push(trimmed.substr(3,3));
    if(trimmed.substr(6,3)!="")
    numbers.push(trimmed.substr(6,4));


    input.value = numbers.join('-');

    }
}