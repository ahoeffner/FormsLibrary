import { PopupWindow } from "./PopupWindow";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { ComponentRef, EmbeddedViewRef, ApplicationRef } from '@angular/core';


export class PopupControl
{
    private win:PopupWindow;
    private element:HTMLElement;
    private appref:ApplicationRef;
    private cmpref:ComponentRef<any>;

    constructor(private app:ApplicationImpl, public component:any) {}

    public display() : void
    {
        this.appref = this.app.builder.getAppRef();
        this.cmpref = this.app.builder.createComponent(PopupWindow);

        this.win = this.cmpref.instance;

        this.win.setApp(this.app);
        this.win.setControl(this);
        this.win.setComponent(this.component);

        this.element = (this.cmpref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        this.appref.attachView(this.cmpref.hostView);
        document.body.appendChild(this.element);
    }

    public close() : void
    {
        this.win.close();
        document.body.removeChild(this.element);
        this.appref.detachView(this.cmpref.hostView);
   }
}