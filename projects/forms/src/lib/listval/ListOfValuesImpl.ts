import { Popup } from "../popup/Popup";
import { Block } from "../blocks/Block";
import { ListOfValues } from "./ListOfValues";
import { Container } from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { OnInit, AfterViewInit, Component } from "@angular/core";


@Component({
    selector: '',
    template:
    `
    Hello
    `
})


export class ListOfValuesImpl extends Block implements Popup, OnInit, AfterViewInit
{
    private win:PopupWindow;
    private app:ApplicationImpl;

    public top:     string = null;
    public left:    string = null;
    public width:   string = null;
    public height:  string = null;
    public title:   string = null;


    public constructor()
    {
        super();
    }


    public setDefinition(lov:ListOfValues) : void
    {
        this.title = lov.title;
        this.width = lov.width;
        this.height = lov.height;
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


    public setApp(app: ApplicationImpl): void
    {
        this.app = app;
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
    }
}