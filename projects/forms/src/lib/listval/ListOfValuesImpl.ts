import { Popup } from "../popup/Popup";
import { ListOfValues } from "./ListOfValues";
import { BlockImpl } from "../blocks/BlockImpl";
import { Container } from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { OnInit, AfterViewInit, Component } from "@angular/core";
import { Context } from "../application/Context";


@Component({
    selector: '',
    template:
    `
    Hello
    `
})


export class ListOfValuesImpl implements Popup, OnInit, AfterViewInit
{
    private impl:BlockImpl;
    private win:PopupWindow;
    private app:ApplicationImpl;

    public top:     string = null;
    public left:    string = null;
    public width:   string = null;
    public height:  string = null;
    public title:   string = null;


    constructor(ctx:Context)
    {
        this.app = ctx.app["_impl_"];
    }


    public setDefinition(lov:ListOfValues) : void
    {
        this.title = lov.title;
        this.width = lov.width;
        this.height = lov.height;
    }


    public setBlockImpl(impl:BlockImpl) : void
    {
        this.impl = impl;
    }


    public close(cancel: boolean): void
    {
        this.app.enable();
        this.win.closeWindow();
        this.app.getCurrentForm()?.focus();
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngOnInit(): void
    {
        this.app.disable();
        this.app.setContainer();
    }


    public ngAfterViewInit(): void
    {
        let container:Container = this.app.getContainer();
        container.finish();

        console.log("impl "+this.impl)
    }
}