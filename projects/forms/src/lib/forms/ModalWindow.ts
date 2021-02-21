import { FormImpl } from "./FormImpl";
import { Preferences } from '../Preferences';
import { FormInstance } from './FormInstance';
import { Protected } from '../utils/Protected';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef, ComponentRef } from '@angular/core';


@Component({
  selector: 'modal',
  template:
  `
    <div #canvas class="modal">
      <div #window class="modal-block" style="top: {{top}}; left: {{left}}">
        <div class="container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span class="center" style="color: {{tcolor}};"></span>
			<span class="close">
				<button style="color: {{btncolor}};" (click)="closeForm()">X</button>
			</span>
		  </div>
          <div class="block" style="margin-top: {{tmargin}};"><div #content></div></div>
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
        height: 1.5em;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
		text-align: center;
        border-bottom: 2px solid black;
    }

	.close
	{
		top: 0;
		right: 0;
		height: 1.5em;
		width: 1.75em;
		position: absolute;
		border-left: 1px solid black;
	}

	button
	{
		top: 50%;
		width: 100%;
		height: 100%;
		outline:none;
		font-size: 0.75em;
		font-weight: bold;
		position: relative;
		background: transparent;
		transform: translateY(-50%);
		border: 0px solid transparent;
		box-shadow: 0px 0px 0px transparent;
		text-shadow: 0px 0px 0px transparent;
	}

	.center
	{
		top: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .block
    {
        left: 0;
        top: 3vh;
        right: 0;
        bottom: 0;
		display: flex;
        overflow: auto;
        position: absolute;
		justify-content: center;
    }
`],
changeDetection: ChangeDetectionStrategy.OnPush
})

export class ModalWindow implements AfterViewInit
{
	private form:FormInstance;
	private app:ApplicationImpl;
	private element:HTMLElement;
    private canvas:HTMLDivElement;
    private window:HTMLDivElement;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;
	private winref:ComponentRef<any>;

    public top : string = "";
    public left : string = "";
    public title : string = null;
    public width : string = "99vw";
    public height : string = "98vh";
    public tmargin : string = "1vh";
	public preferences:Preferences = new Preferences();
    public tcolor  : string = this.preferences.titleColor;
    public bcolor  : string = this.preferences.primaryColor;
    public btncolor : string = this.preferences.btnTextColor;


    @ViewChild("canvas", {read: ElementRef}) private canvasElement: ElementRef;
    @ViewChild("window", {read: ElementRef}) private windowElement: ElementRef;
    @ViewChild("topbar", {read: ElementRef}) private topbarElement: ElementRef;
	@ViewChild('content', {read: ElementRef}) private contentElement:ElementRef;

	constructor(private change:ChangeDetectorRef) {}


	public setForm(form:FormInstance) : void
	{
		this.top = form.windowopts.offsetTop;
		this.left = form.windowopts.offsetLeft;

		this.width = form.windowopts.width;
		this.height = form.windowopts.height;

		if (form.windowopts.width == "")
		{
			this.left = "2px";
			this.width = "99.25vw";
		}

		if (form.windowopts.height == "")
		{
			this.top = "4px";
			this.height = "99vh";
		}

		let impl:FormImpl = Protected.get(form.ref.instance);
		impl.setModalWindow(this);

		this.form = form;
	}


	public newForm(form:FormInstance) : void
	{
		this.title = form.title;

		this.content.removeChild(this.element);
		this.app.builder.getAppRef().detachView(this.form.ref.hostView);

		let impl:FormImpl = Protected.get(form.ref.instance);
		impl.setModalWindow(this);

		this.form = form;
		this.display();
	}


	public setWinRef(winref:ComponentRef<any>) : void
	{
		this.winref = winref;
	}


	public setApplication(app:ApplicationImpl) : void
	{
		this.app = app;
	}


	public closeForm() : void
	{
		let impl:FormImpl = Protected.get(this.form.ref.instance);
		this.close();
		impl.cancel();
	}


	public close() : void
	{
		this.content.removeChild(this.element);
		this.app.builder.getAppRef().detachView(this.form.ref.hostView);

		let element:HTMLElement = (this.winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		this.app.builder.getAppRef().detachView(this.winref.hostView);
		this.winref.destroy();

		this.winref = null;
	}


	private display() : void
	{
		if (this.form == null)
		{
			setTimeout(() => {this.display();},10);
			return;
		}

		this.element = (this.form.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(this.form.ref.hostView);
		this.content.appendChild(this.element);

		this.change.detectChanges();
	}


	public ngAfterViewInit(): void
	{
		this.canvas = this.canvasElement?.nativeElement as HTMLDivElement;
		this.window = this.windowElement?.nativeElement as HTMLDivElement;
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;

		if (this.title != null)
			this.topbar.children[0].innerHTML = this.title;

		this.display();

		this.posy = this.window.offsetTop;
		this.posx = this.window.offsetLeft;
		this.sizex = this.window.offsetWidth;
		this.sizey = this.window.offsetHeight;

		this.canvas.addEventListener("mouseup",() => {this.mouseup();});
		this.canvas.addEventListener("mousemove", (event) => {this.movePopup(event);})
		this.canvas.addEventListener("mousemove", (event) => {this.resizePopup(event);});
		this.canvas.addEventListener("mousemove", (event) => {this.resizemousemove(event);});
		this.canvas.addEventListener("mousedown", (event) => {this.startresize(event);});
		this.topbar.addEventListener("mousedown", (event) => {this.startmove(event);});
	}


	private offx:number = 0;
	private offy:number = 0;

	private posy:number;
	private posx:number;

	private sizex:number;
	private sizey:number;

	private move:boolean = false;
	private resz:boolean = false;

	private resizex:boolean = false;
	private resizey:boolean = false;


	private startmove(event:any) : void
	{
		if (this.resizexy)
			return;

		this.move = true;

		event = event || window.event;
		event.preventDefault();

		this.offy = +event.clientY - this.posy;
		this.offx = +event.clientX - this.posx;
	}

	private mouseup()
	{
		if (!this.move && !this.resz)
			return;

		this.move = false;
		this.resz = false;
		this.resizexy = false;

		this.window.style.cursor = "default";
		document.body.style.cursor = "default";
	}

	private movePopup(event:any) : void
	{
		if (!this.move) return;
	  	event = event || window.event;

		let deltay:number = +event.clientY - this.posy;
		let deltax:number = +event.clientX - this.posx;

		this.posy += (deltay - this.offy);
		this.posx += (deltax - this.offx);

		this.top = this.posy + "px";
		this.left = this.posx + "px";

		this.change.detectChanges();
	}


	private resizemousemove(event:any) : any
	{
		if (this.resz) return;

		event = event || window.event;
		let posx:number = +event.clientX;
		let posy:number = +event.clientY;

		let offx:number = this.posx + this.sizex - posx;
		let offy:number = this.posy + this.sizey - posy;

		let before:boolean = false;
		if (this.resizex || this.resizey) before = true;

		this.resizex = false;
		this.resizey = false;

		if (offx > -7 && offx < 10 && posy > this.posy - 7 && posy < this.posy + this.sizey + 7) this.resizex = true;
		if (offy > -7 && offy < 10 && posx > this.posx - 7 && posx < this.posx + this.sizex + 7) this.resizey = true;

		if (this.resizex && this.resizey)
		{
			this.resizex = true;
			this.resizey = true;
		}

		if (this.resizex && !this.resizey)
		{
			this.window.style.cursor = "e-resize";
			document.body.style.cursor = "e-resize";
		}

		if (this.resizey && !this.resizex)
		{
			this.window.style.cursor = "s-resize";
			document.body.style.cursor = "s-resize";
		}

		if (this.resizex && this.resizey)
		{
			this.window.style.cursor = "se-resize";
			document.body.style.cursor = "se-resize";
		}

		if (before && !this.resizexy)
		{
			this.window.style.cursor = "default";
			document.body.style.cursor = "default";
		}
	}

	private startresize(event:any) : void
	{
	  	if (!this.resizexy)
		  return;

		this.resz = true;
		event = event || window.event;
		event.preventDefault();

		this.offy = +event.clientY;
		this.offx = +event.clientX;
	}

	private resizePopup(event:any) : void
	{
		if (!this.resz) return;
	  	event = event || window.event;

		let deltay:number = +event.clientY - this.offy;
		let deltax:number = +event.clientX - this.offx;

		if (this.resizex)
		{
			this.sizex += deltax;
			this.width = this.sizex+"px";
		}

		if (this.resizey)
		{
			this.sizey += deltay;
			this.height = this.sizey+"px";
		}

		this.offy = +event.clientY;
		this.offx = +event.clientX;

		this.change.detectChanges();
	}

	private get resizexy() : boolean
	{
		if (this.resizex || this.resizey) return(true);
		return(false);
	}

	private set resizexy(on:boolean)
	{
		this.resizex = on;
		this.resizey = on;
	}
}