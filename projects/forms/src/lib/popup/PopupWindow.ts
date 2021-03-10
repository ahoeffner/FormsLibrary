import { Popup } from './Popup';
import { PopupInstance } from './PopupInstance';
import { Preferences } from '../application/Preferences';
import { Listener, onEventListener } from "../utils/Listener";
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef, ComponentRef } from '@angular/core';


@Component({
  selector: 'popupwindow',
  template:
  `
    <div class="popupwindow">
      <div #window class="popupwindow-modal-block" style="top: {{top}}; left: {{left}}">
        <div class="popupwindow-container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="popupwindow-topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span class="popupwindow-center" style="color: {{tcolor}};">
				<span class="popupwindow-corner"></span>
				<div #title></div>
                <span class="popupwindow-close">
                    <button class="popupwindow-button" style="color: {{btncolor}};" (click)="close(true)">X</button>
                </span>
			</span>
		   </div>
          <div class="popupwindow-block" style="margin-top: {{tmargin}};"><div #content></div></div>
        </div>
      </div>
    </div>
  `,
  styles:
  [`
    .popupwindow
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

    .popupwindow-modal-block
    {
      position: absolute;
      background-color: #fefefe;
    }

    .popupwindow-container
    {
        position: relative;
        border: 2px solid black;
    }

    .popupwindow-topbar
    {
        height: 1.70em;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
		justify-content: center;
        border-bottom: 2px solid black;
    }

	.popupwindow-corner
	{
		width: 1.5em;
		display: block;
		position: relative;
	}

	.popupwindow-close
	{
		top: 0;
		right: 0;
		width: 1.75em;
		height: 1.70em;
		position: absolute;
		border-left: 1px solid black;
	}

	.popupwindow-button
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

	.popupwindow-center
	{
		top: 0;
		bottom: 0;
		width: 93%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .popupwindow-block
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

export class PopupWindow implements onEventListener, AfterViewInit
{
	private popup:Popup;
	private title:string;
    private pinst:PopupInstance;
    private app:ApplicationImpl;
	private element:HTMLElement;
    private window:HTMLDivElement;
    private topbar:HTMLDivElement;
	private content:HTMLDivElement;
    private titlebar:HTMLDivElement;
	private winref:ComponentRef<any>;

    public top : string = "5vh";
    public left : string = "10vw";
    public width : string = "40vw";
    public height : string = "30vh";
    public tmargin : string = "1vh";

	public preferences:Preferences = new Preferences();

    @ViewChild("title", {read: ElementRef}) private titlebarElement: ElementRef;
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


	constructor(private change:ChangeDetectorRef)
    {
    }


	public get tcolor() : string
	{
		return(this.preferences.colors.title);
	}


	public get bcolor() : string
	{
		return(this.preferences.colors.topbar);
	}


	public get btncolor() : string
	{
		return(this.preferences.colors.buttontext);
	}


    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public setPopup(pinst:PopupInstance) : void
    {
        this.pinst = pinst;
		this.popup = pinst.popupref.instance;

		this.popup.setWin(this);
		this.title = this.popup.title;

		if (this.popup.hasOwnProperty("top")) this.top = this.popup.top;
		if (this.popup.hasOwnProperty("left")) this.left = this.popup.left;
		if (this.popup.hasOwnProperty("width")) this.width = this.popup.width;
		if (this.popup.hasOwnProperty("height")) this.height = this.popup.height;
    }


	public setWinRef(winref:ComponentRef<any>) : void
	{
		this.winref = winref;
	}


	public close(cancel:boolean) : void
	{
		this.closeWindow();
		this.popup.close(cancel);
	}


	public closeWindow() : void
	{
		if (this.winref == null) return;
		
		Listener.remove("modal","mouseup");
		Listener.remove("modal","mousemove");
		Listener.remove("modal","mousedown");

		let formelem:Element = this.content.firstElementChild;
		if (formelem != null) this.content.removeChild(formelem);
		this.app.builder.getAppRef().detachView(this.pinst.popupref.hostView);

		let element:HTMLElement = (this.winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		this.app.builder.getAppRef().detachView(this.winref.hostView);
		this.winref.destroy();

		this.winref = null;
	}


	private display() : void
	{
		if (this.pinst == null)
		{
			setTimeout(() => {this.display();},10);
			return;
		}

		this.element = (this.pinst.popupref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		this.app.builder.getAppRef().attachView(this.pinst.popupref.hostView);
		this.content.appendChild(this.element);

		this.minh = 150;
		this.minw = 300;

		this.titlebar.innerHTML = this.title;
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


	public ngAfterViewInit(): void
	{
		this.window = this.windowElement?.nativeElement as HTMLDivElement;
		this.topbar = this.topbarElement?.nativeElement as HTMLDivElement;
		this.content = this.contentElement?.nativeElement as HTMLDivElement;
		this.titlebar = this.titlebarElement?.nativeElement as HTMLDivElement;

		this.display();

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