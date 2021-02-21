import { DropDownMenu } from './DropDownMenu';
import { Protected } from '../utils/Protected';
import { Application } from '../application/Application';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit, ComponentRef, EmbeddedViewRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'menuarea',
    template:
	`
		<div #menu></div>
	`
    , changeDetection: ChangeDetectionStrategy.OnPush
})


export class MenuArea implements AfterViewInit
{
    private app:ApplicationImpl;
    private menu:HTMLDivElement;
    private element:HTMLElement;
    @ViewChild("menu", {read: ElementRef}) private elem: ElementRef;


    constructor(app:Application, private change:ChangeDetectorRef)
    {
        this.app = Protected.get<ApplicationImpl>(app);
    }


    public display(menu:ComponentRef<DropDownMenu>) : void
    {
		if (this.menu == null)
		{
			setTimeout(() => {this.display(menu);},10);
			return;
		}

        this.element = (menu.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(menu.hostView);
		this.menu.appendChild(this.element);
		this.change.detectChanges();
    }


    public ngAfterViewInit(): void
    {
        this.menu = this.elem?.nativeElement as HTMLDivElement;
		this.app.setMenuArea(this);
    }
}