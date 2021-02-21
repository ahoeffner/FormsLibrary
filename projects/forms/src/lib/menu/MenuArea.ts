import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
    selector: 'menuarea',
    template:
	`
		<div #menu>MenuArea</div>
	`
})


export class MenuArea implements AfterViewInit
{
    private html:HTMLDivElement;
    @ViewChild("html", {read: ElementRef}) private elem: ElementRef;

    public ngAfterViewInit(): void
    {
        this.html = this.elem?.nativeElement as HTMLDivElement;
    }
}