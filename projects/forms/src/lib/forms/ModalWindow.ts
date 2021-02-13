import { FormImpl } from './FormImpl';
import { Preferences } from '../Preferences';
import { FormInstance, ModalOptions } from './FormsDefinition';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit, ComponentRef, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Protected } from '../utils/Protected';


@Component({
  selector: 'alex-window',
  template:
  `
    <div class="modal">
      <div class="modal-block" style="top: {{top}}px; left: {{left}}px">
        <div class="container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		  <span style="display: inline-block; vertical-align: middle;">{{title}}</span></div>
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
`],
changeDetection: ChangeDetectionStrategy.OnPush
})


export class ModalWindow implements AfterViewInit
{
	private impl:FormImpl;
	private form:FormInstance;
	private element:HTMLElement;
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

    constructor(private change:ChangeDetectorRef) {}


	public setForm(form:FormInstance, options:ModalOptions) : void
	{
		this.title = form.title;
		this.top = options.offsetTop;
		this.left = options.offsetLeft;
		this.width = options.width+"px";
		this.height = options.height+"px";
		this.impl = Protected.get(form.ref.instance);

		this.form = form;
	}


	private display() : void
	{
		if (this.form == null)
		{
			setTimeout(() => {this.display();},10);
			return;
		}

		let app:ApplicationImpl = this.impl.getApplication();

		this.element = (this.form.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.content.appendChild(this.element);

		this.change.detectChanges();
	}


	public close() : void
	{
		this.content.removeChild(this.element);
		let app:ApplicationImpl = this.impl.getApplication();
		app.builder.getAppRef().detachView(this.form.ref.hostView);
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

		this.change.detectChanges();
	}
}