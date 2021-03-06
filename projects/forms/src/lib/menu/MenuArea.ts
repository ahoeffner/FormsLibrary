import { DropDownMenu } from './DropDownMenu';
import { Context } from '../application/Context';
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
    private menuref:ComponentRef<any>;
    @ViewChild("menu", {read: ElementRef}) private elem: ElementRef;


    constructor(ctx:Context, private change:ChangeDetectorRef)
    {
        this.app = ctx.app["_impl_"];
    }


    public remove() : void
    {
        if (this.element != null)
        {
            let menuelem:Element = this.menu.firstElementChild;
            if (menuelem != null) this.menu.removeChild(menuelem);
            this.app.builder.getAppRef().detachView(this.menuref.hostView);
        }

        this.change.detectChanges();
    }


    public display(menu:ComponentRef<DropDownMenu>) : void
    {
        if (menu == null)
        {
            this.remove();
            return;
        }

		if (this.menu == null)
		{
			setTimeout(() => {this.display(menu);},10);
			return;
		}

        if (this.element != null)
        {
            let menuelem:Element = this.menu.firstElementChild;
            if (menuelem != null) this.menu.removeChild(menuelem);
            this.app.builder.getAppRef().detachView(this.menuref.hostView);
        }

        this.menuref = menu;

        this.element = (menu.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(this.menuref.hostView);
		this.menu.appendChild(this.element);
		this.change.detectChanges();
    }


    public ngAfterViewInit(): void
    {
        this.menu = this.elem?.nativeElement as HTMLDivElement;
		this.app.setMenuArea(this);
    }
}