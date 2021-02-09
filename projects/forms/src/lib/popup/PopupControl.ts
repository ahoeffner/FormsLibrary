import { Popup } from "./Popup";
import { Builder } from "../utils/Builder";
import { PopupWindow } from "./PopupWindow";
import { ComponentRef, EmbeddedViewRef, ApplicationRef } from '@angular/core';


export class PopupControl
{
    private win:PopupWindow;
    private app:ApplicationRef;
    private element:HTMLElement;
    private ref:ComponentRef<any>;

    constructor(private builder:Builder, public component:any) {}

    public display() : void
    {
        this.app = this.builder.getAppRef();
        this.ref = this.builder.createComponent(PopupWindow);

        this.win = this.ref.instance;

        this.win.setControl(this);
        this.win.setBuilder(this.builder);
        this.win.setComponent(this.component);

        this.element = (this.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        this.app.attachView(this.ref.hostView);
        document.body.appendChild(this.element);
    }


    public close() : void
    {
        this.win.close();
        document.body.removeChild(this.element);
        this.app.detachView(this.ref.hostView);
   }
}