import { Context } from "./Context";
import { Popup } from "../popup/Popup";
import { PopupWindow } from "../popup/PopupWindow";
import { ApplicationImpl } from "./ApplicationImpl";
import { PopupInstance } from "../popup/PopupInstance";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";


@Component({
    template:
    `
        <div #keymap></div>
        <button style="width: 100%; height: 1px" #ok></button>
    `
})


export class KeyMapHelp implements Popup, AfterViewInit
{
    public top?: string;
    public left?: string;
    public width?: string = "300px";
    public height?: string = "475px";
    public title: string = "ShortKeys";

    private html:string = null;
    private win:PopupWindow = null;
    private map:HTMLDivElement = null;
    private okbtn:HTMLButtonElement = null;

    @ViewChild("ok", {read: ElementRef}) private okelem: ElementRef;
    @ViewChild("keymap", {read: ElementRef}) private mapelem: ElementRef;


    public static show(app:ApplicationImpl)
    {
        let pinst:PopupInstance = new PopupInstance();
        pinst.display(app,KeyMapHelp);
    }


    constructor(ctx:Context)
    {
        this.title = ctx.conf.keymaptitle;
        this.html = ctx.conf.keymapping.map;
    }


    public close(_cancel: boolean): void
    {
        this.win.closeWindow();
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngAfterViewInit(): void
    {
		this.map = this.mapelem?.nativeElement as HTMLDivElement;
		this.okbtn = this.okelem?.nativeElement as HTMLButtonElement;

        this.okbtn.addEventListener("keydown",() => this.close(true));
        this.okbtn.addEventListener("keypress",() => this.close(true));

        this.map.innerHTML = this.html;
        this.okbtn.focus();
    }
}