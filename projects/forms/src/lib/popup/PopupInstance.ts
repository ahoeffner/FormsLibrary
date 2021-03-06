import { Popup } from './Popup';
import { PopupWindow } from './PopupWindow';
import { ComponentRef, EmbeddedViewRef } from "@angular/core";
import { ApplicationImpl } from '../application/ApplicationImpl';

export class PopupInstance
{
    public popupref:ComponentRef<Popup>;

    public display(app:ApplicationImpl, popup:any) : void
    {
        this.popupref = app.builder.createComponent(popup);

        let winref:ComponentRef<any> = app.builder.createComponent(PopupWindow);
        let win:PopupWindow = winref.instance;

        win.setPopup(this);
        win.setWinRef(winref);

        let element:HTMLElement = (winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        app.builder.getAppRef().attachView(winref.hostView);

        document.body.appendChild(element);
    }


    public popup() : Popup
    {
        return(this.popupref.instance);
    }
}