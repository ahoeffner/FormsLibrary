import { FormImpl } from "./FormImpl";
import { FormInstance } from './FormInstance';
import { Protected } from '../utils/Protected';
import { DropDownMenu } from "../menu/DropDownMenu";
import { Preferences } from '../application/Preferences';
import { Listener, onEventListener } from "../utils/Listener";
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
		    <span class="center" style="color: {{tcolor}};"><div #menu></div></span>
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
		justify-content: center;
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
		width: 93%;
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

export class ModalWindow implements onEventListener, AfterViewInit
{
	private form:FormInstance;
	private app:ApplicationImpl;
	private element:HTMLElement;
    private menu:HTMLDivElement;
    private window:HTMLDivElement;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;
	private winref:ComponentRef<any>;

    public top : string = "";
    public left : string = "";
    public width : string = "99vw";
    public height : string = "98vh";
    public tmargin : string = "1vh";

	public preferences:Preferences = new Preferences();
    public tcolor  : string = this.preferences.colors.title;
    public bcolor  : string = this.preferences.colors.topbar;
    public btncolor : string = this.preferences.colors.buttontext;

    @ViewChild("menu", {read: ElementRef}) private menuElement: ElementRef;
    @ViewChild("window", {read: ElementRef}) private windowElement: ElementRef;
    @ViewChild("topbar", {read: ElementRef}) private topbarElement: ElementRef;
	@ViewChild('content', {read: ElementRef}) private contentElement:ElementRef;

	private minw:number = 0;
	private minh:number = 0;

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

		let impl:FormImpl = Protected.get(form.formref.instance);
		impl.setModalWindow(this);

		this.form = form;
	}


	public newForm(form:FormInstance) : void
	{
		this.content.removeChild(this.element);
		this.app.builder.getAppRef().detachView(this.form.formref.hostView);

		let impl:FormImpl = Protected.get(form.formref.instance);
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
		let impl:FormImpl = Protected.get(this.form.formref.instance);
		this.close();
		impl.cancel();
	}


	public close() : void
	{
		Listener.remove("modal","mouseup");
		Listener.remove("modal","mousemove");
		Listener.remove("modal","mousedown");

		this.content.removeChild(this.element);
		this.app.builder.getAppRef().detachView(this.form.formref.hostView);

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

		this.element = (this.form.formref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(this.form.formref.hostView);
		this.content.appendChild(this.element);

		this.showmenu()
		this.change.detectChanges();
	}


	private showmenu() : void
	{
		let impl:FormImpl = Protected.get(this.form.formref.instance);
		let menu:ComponentRef<any> = impl.getFormMenu();

		let element:Element = (menu.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(menu.hostView);
		this.menu.appendChild(element);

		let ddmenu:DropDownMenu = menu.instance;
		this.initmenu(ddmenu);
	}


	private initmenu(ddmenu:DropDownMenu) : void
	{
		if (ddmenu.getMenu() == null)
		{
			setTimeout(() => {this.initmenu(ddmenu)},10);
			return;
		}

		let impl:FormImpl = Protected.get(this.form.formref.instance);
		ddmenu.getMenu().setForm(impl.getForm());

		this.minh = 100;
		this.minw = this.menu.clientWidth + 50;
	}


	public ngAfterViewInit(): void
	{
		this.menu = this.menuElement?.nativeElement as HTMLDivElement;
		this.window = this.windowElement?.nativeElement as HTMLDivElement;
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;

		this.display();

		this.posy = this.window.offsetTop;
		this.posx = this.window.offsetLeft;
		this.sizex = this.window.offsetWidth;
		this.sizey = this.window.offsetHeight;

		Listener.add("modal",this,"mouseup");
		Listener.add("modal",this,"mousemove");
		Listener.add("modal",this,"mousedown");

		this.topbar.addEventListener("mousedown", (event) => {this.startmove(event);});
	}


    public onEvent(event:any) : void
	{
		switch(event.type)
		{
			case "mouseup":
				this.mouseup();
				break;

			case "mousemove":
				this.movePopup(event);
				this.resizePopup(event);
				this.resizemousemove(event);
				break;

			case "mousedown":
				this.startmove(event);
				this.startresize(event);
				break;
		}
	}

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

		if (this.resizex && (this.sizex > this.minw || deltax > 0))
		{
			this.sizex += deltax;
			this.width = this.sizex+"px";
		}

		if (this.resizey && (this.sizey > this.minh || deltay > 0))
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