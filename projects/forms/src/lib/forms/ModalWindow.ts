import { FormImpl } from "./FormImpl";
import { Preferences } from '../Preferences';
import { Protected } from '../utils/Protected';
import { FormInstance } from './FormsDefinition';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef, ComponentRef } from '@angular/core';


@Component({
  selector: 'modal',
  template:
  `
    <div class="modal">
      <div #window class="modal-block" style="top: {{top}}; left: {{left}}">
        <div class="container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span style="display: inline-block; vertical-align: middle;">{{title}}</span>
			<span style="position: absolute; right: 0">
				<button href="" (click)="closeForm()">X</button>
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
    private window:HTMLDivElement;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;
	private winref:ComponentRef<any>;

    public top : string = "";
    public left : string = "";
    public title : string = "???";
    public width : string = "99vw";
    public height : string = "98vh";
    public tmargin : string = "1vh";
    public tcolor  : string = Preferences.get().textColor;
    public bcolor  : string = Preferences.get().primaryColor;


    @ViewChild("window", {read: ElementRef}) private windowElement: ElementRef;
    @ViewChild("topbar", {read: ElementRef}) private topbarElement: ElementRef;
	@ViewChild('content', {read: ElementRef}) private contentElement:ElementRef;

	constructor(private change:ChangeDetectorRef) {}


	public setForm(form:FormInstance) : void
	{
		this.title = form.title;

		this.top = form.modalopts.offsetTop;
		this.left = form.modalopts.offsetLeft;

		this.width = form.modalopts.width;
		this.height = form.modalopts.height;

		if (form.modalopts.width == "")
		{
			this.width = "98vw";
			this.top = "10px";
		}

		if (form.modalopts.height == "")
		{
			this.height = "98vh";
			this.left = "10px";
		}

		this.form = form;
	}


	public newForm(form:FormInstance) : void
	{
		this.title = form.title;

		this.content.removeChild(this.element);
		this.app.builder.getAppRef().detachView(this.form.ref.hostView);

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

		let impl:FormImpl = Protected.get(this.form.ref.instance);
		impl.setModalWindow(this);
	}


	public ngAfterViewInit(): void
	{
		this.window = this.windowElement?.nativeElement as HTMLDivElement;
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;

		this.display();

		this.posy = this.window.offsetTop;
		this.posx = this.window.offsetLeft;
		this.sizex = this.window.offsetWidth;
		this.sizey = this.window.offsetHeight;

		document.addEventListener("mouseup",() => {this.mouseup();});
		document.addEventListener("mousemove", (event) => {this.movePopup(event);})
		document.addEventListener("mousemove", (event) => {this.resizePopup(event);});
		document.addEventListener("mousemove", (event) => {this.resizemousemove(event);});
		document.addEventListener("mousedown", (event) => {this.startresize(event);});

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

		if (offx > -5 && offx < 10 && posy > this.posy - 7 && posy < this.posy + this.sizey + 7) this.resizex = true;
		if (offy > -5 && offy < 10 && posx > this.posx - 7 && posx < this.posx + this.sizex + 7) this.resizey = true;

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
		console.log("resize");
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