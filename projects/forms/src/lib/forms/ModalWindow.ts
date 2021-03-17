import { Form } from "./Form";
import { FormImpl } from "./FormImpl";
import { FormInstance } from './FormInstance';
import { Config } from "../application/Config";
import { DropDownMenu } from "../menu/DropDownMenu";
import { ApplicationImpl } from '../application/ApplicationImpl';
import { WindowListener, onEventListener } from "../events/WindowListener";
import { Component, ViewChild, ElementRef, AfterViewInit, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef, ComponentRef } from '@angular/core';


@Component({
  selector: 'modalwindow',
  template:
  `
    <div class="modalwindow">
      <div #window class="modalwindow-modal-block" style="top: {{top}}; left: {{left}}">
        <div class="modalwindow-container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="modalwindow-topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span class="modalwindow-center" style="color: {{tcolor}};">
				<span class="modalwindow-corner"></span>
				<div #menu></div>
				<span class="modalwindow-close">
					<button class="modalwindow-button" style="color: {{btncolor}};" (click)="close()">X</button>
				</span>
			</span>
		  </div>
          <div class="modalwindow-block" style="margin-top: {{tmargin}};"><div #content></div></div>
        </div>
      </div>
    </div>
  `,
  styles:
  [`
    .modalwindow
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

    .modalwindow-modal-block
    {
      position: absolute;
      background-color: #fefefe;
    }

    .modalwindow-container
    {
        position: relative;
        border: 2px solid black;
    }

    .modalwindow-topbar
    {
        height: 1.70em;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
		justify-content: center;
        border-bottom: 2px solid black;
    }

	.modalwindow-corner
	{
		width: 2.5em;
		display: block;
		position: relative;
	}

	.modalwindow-close
	{
		top: 0;
		right: 0;
		width: 1.75em;
		height: 1.70em;
		position: absolute;
		border-left: 1px solid black;
	}

	.modalwindow-button
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

	.modalwindow-center
	{
		top: 0;
		bottom: 0;
		width: 93%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .modalwindow-block
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
	private menuelem:HTMLElement;
    private window:HTMLDivElement;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;
	private winref:ComponentRef<any>;
	private menuref:ComponentRef<any>;

    public top : string = "";
    public left : string = "";
    public width : string = "99vw";
    public height : string = "98vh";
    public tmargin : string = "1vh";

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


	constructor(private conf:Config, private change:ChangeDetectorRef)
	{
	}

	public get tcolor() : string
	{
		return(this.conf.colors.title);
	}

	public get bcolor() : string
	{
		return(this.conf.colors.topbar);
	}

	public get btncolor() : string
	{
		return(this.conf.colors.menuoption);
	}


	public setForm(form:FormInstance) : void
	{
		this.resize(form,true);

		let impl:FormImpl = form.formref.instance["_impl_"];
		impl.setModalWindow(this);

		this.form = form;
	}


	public getForm() : Form
	{
		return(this.form.formref.instance);
	}


	public newForm(form:FormInstance) : void
	{
		if (!form.windowopts?.inherit) this.resize(form,false);

		let formelem:Element = this.content.firstElementChild;
		if (formelem != null) this.content.removeChild(formelem);
		this.app.builder.getAppRef().detachView(this.form.formref.hostView);

		if (this.menuelem != null)
		{
			let menuelem = this.menu.firstElementChild;
			if (menuelem != null) this.menu.removeChild(this.menuelem);
			this.app.builder.getAppRef().detachView(this.menuref.hostView);
		}

		let impl:FormImpl = form.formref.instance["_impl_"];
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


	public close() : void
	{
		let impl:FormImpl = this.form.formref.instance["_impl_"];
		this.closeWindow();
		impl.cancel();
	}


	public closeWindow() : void
	{
		WindowListener.remove("modal","mouseup");
		WindowListener.remove("modal","mousemove");
		WindowListener.remove("modal","mousedown");

		let formelem:Element = this.content.firstElementChild;
		if (formelem != null) this.content.removeChild(formelem);
		this.app.builder.getAppRef().detachView(this.form.formref.hostView);

		let element:HTMLElement = (this.winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		this.app.builder.getAppRef().detachView(this.winref.hostView);
		this.winref.destroy();

		this.winref = null;
	}


	private resize(form:FormInstance, pos:boolean) : void
	{
		if (pos)
		{
			this.top = form.windowopts.offsetTop;
			this.left = form.windowopts.offsetLeft;
		}

		this.width = form.windowopts.width;
		this.height = form.windowopts.height;

		if (form.windowopts.width == "")
		{
			this.left = "0";
			this.width = "100%";
		}

		if (form.windowopts.height == "")
		{
			this.top = "0";
			this.height = "100%";
		}
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

		this.minh = 100;
		this.minw = 450;

		this.showmenu()
		this.change.detectChanges();

		this.posy = this.window.offsetTop;
		this.posx = this.window.offsetLeft;
		this.sizex = this.window.offsetWidth;
		this.sizey = this.window.offsetHeight;

		let resize:boolean = false;

		if (this.sizex < this.minw)
		{
			resize = true;
			this.sizex = this.minw;
			this.width = this.sizex+"px";
		}

		if (this.sizey < this.minh)
		{
			resize = true;
			this.sizey = this.minh;
			this.height = this.sizey+"px";
		}

		if (resize) this.change.detectChanges();
	}


	private showmenu() : void
	{
		let impl:FormImpl = this.form.formref.instance["_impl_"];

		this.menuelem = null;
		this.menuref = impl.getDropDownMenu();

		if (this.menuref == null) return;
		this.menuelem = (this.menuref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(this.menuref.hostView);
		this.menu.appendChild(this.menuelem);

		let ddmenu:DropDownMenu = this.menuref.instance;
		this.initmenu(ddmenu);
	}


	private initmenu(ddmenu:DropDownMenu) : void
	{
		if (ddmenu.getMenu() == null)
		{
			setTimeout(() => {this.initmenu(ddmenu)},10);
			return;
		}

		let impl:FormImpl = this.form.formref.instance["_impl_"];
		ddmenu.getMenu().getHandler().onFormChange(impl.form);

		this.minw = this.menu.clientWidth + 50;

		if (this.sizex < this.minw)
		{
			this.sizex = this.minw;
			this.width = this.sizex+"px";
			this.change.detectChanges();
		}
	}


	public ngAfterViewInit(): void
	{
		this.menu = this.menuElement?.nativeElement as HTMLDivElement;
		this.window = this.windowElement?.nativeElement as HTMLDivElement;
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;

		this.display();

		WindowListener.add("modal",this,"mouseup");
		WindowListener.add("modal",this,"mousemove");
		WindowListener.add("modal",this,"mousedown");

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

		if (this.posy > 0)
			this.top = this.posy + "px";

		if (this.posx > 0)
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