import { Popup } from './Popup';
import { Builder } from '../utils/Builder';
import { PopupWindow } from './PopupWindow';
import { Application } from '../application/Application';
import { ComponentRef, EmbeddedViewRef } from "@angular/core";
import { ApplicationImpl } from '../application/ApplicationImpl';

export class PopupInstance
{
    public popupref:ComponentRef<Popup>;

    public display(app:ApplicationImpl, popup:any)
    {
        this.popupref = app.builder.createComponent(popup);
        this.popupref.instance.setApp(app);

        let winref:ComponentRef<any> = app.builder.createComponent(PopupWindow);
        let win:PopupWindow = winref.instance;

        win.setApp(app);
        win.setPopup(this);
        win.setWinRef(winref);

        let element:HTMLElement = (winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        app.builder.getAppRef().attachView(winref.hostView);

        document.body.appendChild(element);
    }
}