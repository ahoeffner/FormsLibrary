import { Popup } from "./Popup";
import { PopupWindow } from "./PopupWindow";
import { PopupInstance } from "./PopupInstance";
import { Context } from "../application/Context";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";


@Component({
    selector: '',
    template:
    `
        <div class="messagebox">
            <div #msg class="messagebox-msg"></div>
            <div class="messagebox-buttom">
                <button #accept class="messagebox-btn" style="color: {{tcolor}}; background-color: {{bcolor}};">Ok</button>
            </div>
        </div>
        `,
    styles: [`
        .messagebox
        {
            top: 0px;
            left: 1px;
            right: 1px;
            bottom: 0px;
            display: block;
            position: absolute;
        }

        .messagebox-msg
        {
            height: 80px;
            display: flex;
            text-align: center;
            word-wrap: break-all;
            justify-content: center;
        }

        .messagebox-buttom
        {
            right: 1px;
            bottom: 4px;
            witdh: 35px;
            height: 35px;
            display: block;
            position: absolute;
        }

        .messagebox-btn
        {
            border: none;
            padding: 10px;
            outline: none;
            font-size: 15px;
            cursor: pointer;
            text-align: center;
            border-radius: 100%;
            display: inline-block;
            text-decoration: none;
        }
    `]
})

export class MessageBox implements Popup, AfterViewInit
{
    public top:string    = "20%";
    public left:string   = "25%";
    public width$:string  = "100px";
    public height$:string = "100px";
    public title$:string  = "alert";
    public message:string = "the message";

    private win:PopupWindow;
    private app: ApplicationImpl;
    private msg:HTMLDivElement = null;
    private btn:HTMLButtonElement = null;

    @ViewChild("msg", {read: ElementRef}) private msgelem: ElementRef;
    @ViewChild("accept", {read: ElementRef}) private acceptelem: ElementRef;


    public static show(app:ApplicationImpl, message:string, title?:string, width?:string, height?:string)
    {
        let pinst:PopupInstance = new PopupInstance();

        pinst.display(app,MessageBox);
        let mbox:MessageBox = pinst.popup() as MessageBox;

        mbox.title = title;
        mbox.message = message;

        if (width != null) mbox.width = width;
        if (height != null) mbox.height = height;
    }


    public constructor(ctx:Context)
    {
        this.app = ctx.app["_impl_"];
    }


	public get bcolor() : string
	{
		return(this.app.config.colors.topbar);
	}


	public get tcolor() : string
	{
		return(this.app.config.colors.buttontext);
	}


    public set width(width:string)
    {
        this.width$ = width;
    }


    public get width() : string
    {
        return(this.width$);
    }


    public set height(height:string)
    {
        this.height$ = height;
    }


    public get height() : string
    {
        return(this.height$);
    }


    public set title(title:string)
    {
        this.title$ = title;
        this.win.title = this.title;
    }


    public get title() : string
    {
        return(this.title$);
    }


    public setWin(win:PopupWindow): void
    {
        this.win = win;
    }


    public close(_cancel: boolean): void
    {
        this.btn.removeEventListener("click",() => {this.close(false)});
        this.btn.removeEventListener("keydown",() => {this.close(false)});

        this.win.closeWindow();
        this.app.getCurrentForm()?.focus();
    }


    public ngAfterViewInit() : void
    {
        this.msg = this.msgelem?.nativeElement as HTMLDivElement;
        this.btn = this.acceptelem?.nativeElement as HTMLButtonElement;

        setTimeout(() => {this.addTriggers()},1);

        this.msg.innerHTML = this.message;
        this.keepFocus(0);
    }


    private addTriggers() : void
    {
        this.btn.addEventListener("click",() => {this.close(false)});
        this.btn.addEventListener("keydown",() => {this.close(false)});
    }


    private keepFocus(delay:number) : void
    {
        this.btn.focus();
        setTimeout(() => {this.keepFocus(delay+1)},delay);
    }
}