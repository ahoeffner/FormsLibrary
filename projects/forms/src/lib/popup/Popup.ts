import { PopupControl } from "./PopupControl";


export class Popup
{
    private ctrl:PopupControl;

    private setProtected(impl:PopupControl) : void
    {
        this.ctrl = impl;
    }

    public getTitle() : string
    {
        return("???");
    }

    public getOffsetTop() : number
    {
        return(40);
    }

    public getOffsetLeft() : number
    {
        return(60);
    }

    public getWidth() : number
    {
        return(500);
    }

    public getHeight() : number
    {
        return(300);
    }

    public close() : void
    {
        this.ctrl.close();
    }
}