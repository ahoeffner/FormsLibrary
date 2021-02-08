import { PopupImpl } from './PopupImpl';
import { Builder } from '../utils/Builder';
import { Preferences } from '../Preferences';
import { Component, ViewChild, ElementRef, AfterViewInit, ComponentRef, EmbeddedViewRef } from '@angular/core';


@Component({
  selector: 'popup',
  template:
  `
    <div class="modal">
      <div class="modal-block" style="top: {{top}}px; left: {{left}}px">
        <div class="container" style="width: {{width}}; height: {{height}};">
          <div #topbar class="topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">{{title}}</div>
          <div class="block"><div #content></div></div>
        </div>
      </div>
    </div>
  `,
  styles:
  [`
    .modal
    {
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
        overflow: auto;
        position: fixed;
    }

    .modal-block
    {
      top: 20vh;
      left: 30vw;
      position: absolute;
      background-color: #fefefe;
    }

    .container
    {
        position: relative;
        border: 2px solid black;
    }

    .topbar
    {
        height: 3vh;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
        font-size: larger;
        text-align: center;
    }

    .block
    {
        left: 0;
        top: 3vh;
        right: 0;
        bottom: 0;
        overflow: auto;
        position: absolute;
    }
`]
})

export class PopupWindow implements AfterViewInit
{
	private builder:Builder;
	private popup:PopupImpl;
	private element:HTMLElement;
	private ref:ComponentRef<any>;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;

    public top : number = 40;
    public left : number = 60;
    public title : string = "???";
    public width : string = "30vw";
    public height : string = "30vh";
    public tcolor  : string = Preferences.get().textColor;
    public bcolor  : string = Preferences.get().primaryColor;


    @ViewChild("topbar", {read: ElementRef}) private topbarElement: ElementRef;
    @ViewChild('content', {read: ElementRef}) private contentElement:ElementRef;


	public setPopupImpl(popup:PopupImpl) : void
	{
		this.top = popup.top;
		this.left = popup.left;
		this.width = popup.width;
		this.height = popup.height;
		this.title = popup.title;
		this.popup = popup;
	}


	public setBuilder(builder:Builder) : void
	{
		this.builder = builder;
	}


	private display() : void
	{
		if (this.builder == null)
		{
			setTimeout(() => {this.display();},10);
			return;
		}

		this.ref = this.builder.createComponent(this.popup.component);
		this.element = (this.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.builder.getAppRef().attachView(this.ref.hostView);
        this.content.appendChild(this.element);
	}


	public close() : void
	{
		this.content.removeChild(this.element);
		this.builder.getAppRef().detachView(this.ref.hostView);
		this.ref.destroy();
	}


	public ngAfterViewInit(): void
	{
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;
		this.topbar.addEventListener("mouseup", () => {this.mouseup();});
		this.topbar.addEventListener("mousedown", (event) => {this.mousedown(event);});

		this.display();
	}


	private offx:number = 0;
	private offy:number = 0;
	private move:boolean = false;

	private mouseup()
	{
		if (this.move)
		{
			this.move = false;
			window.removeEventListener("mouseup", () => {this.mouseup()});
			window.removeEventListener("mousemove", (event) => {this.movePopup(event);});
	  	}
	}

	private mousedown(event:any) : void
	{
	  	if (!this.move)
	  	{
			this.move = true;
			setTimeout(() => {this.mousedown(event)},1);
	  	}
	  	else
	  	{
			event = event || window.event;

			event.preventDefault();
			window.addEventListener("mouseup",() => {this.mouseup();})
			window.addEventListener("mousemove", (event) => {this.movePopup(event);})

			this.move = true;
			this.offy = +event.clientY - this.top;
			this.offx = +event.clientX - this.left;
	  	}
	}

	private movePopup(event:any) : void
	{
		if (!this.move) return;
	  	event = event || window.event;

		let deltay:number = +event.clientY - this.top;
		let deltax:number = +event.clientX - this.left;

		this.top += (deltay - this.offy);
		this.left += (deltax - this.offx);

		this.topbar.style.top = this.top + "px";
		this.topbar.style.left = this.left + "px";
	}
}