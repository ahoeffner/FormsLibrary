import { Builder } from "../utils/Builder";
import { PopupWindow } from "./PopupWindow";
import { ComponentRef, EmbeddedViewRef, ApplicationRef } from '@angular/core';


export class PopupImpl
{
    private win:PopupWindow;
    private app:ApplicationRef;
    private element:HTMLElement;
    private ref:ComponentRef<any>;

    public top : number = 40;
    public left : number = 60;
    public title : string = "???";
    public width : string = "30vw";
    public height : string = "30vh";

    constructor(public component:any) {}

    public display(builder:Builder) : void
    {
        this.app = builder.getAppRef();
        this.ref = builder.createComponent(PopupWindow);

        this.win = this.ref.instance;

        this.win.setPopupImpl(this);
        this.win.setBuilder(builder);

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