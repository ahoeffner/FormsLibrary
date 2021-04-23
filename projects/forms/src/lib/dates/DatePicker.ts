import { Popup } from "../popup/Popup";
import { BlockImpl } from "../blocks/BlockImpl";
import { PopupWindow } from "../popup/PopupWindow";
import { PopupInstance } from "../popup/PopupInstance";
import { AfterViewInit, Component } from "@angular/core";
import { ApplicationImpl } from "../application/ApplicationImpl";


@Component({
    template:
    `
    Hello
    `
})


export class DatePicker implements Popup, AfterViewInit
{
    public top?: string;
    public left?: string;
    public width?: string;
    public height?: string;
    public title: string = "Calendar";

    private win:PopupWindow = null;


    public static show(app:ApplicationImpl, impl:BlockImpl)
    {
        let pinst:PopupInstance = new PopupInstance();
        pinst.display(app,DatePicker);

        let dpwin:DatePicker = pinst.popup() as DatePicker;
    }


    public close(cancel: boolean): void
    {
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngAfterViewInit(): void
    {
    }
}