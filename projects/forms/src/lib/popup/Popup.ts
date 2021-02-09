import { PopupControl } from "./PopupControl";
import { Parameters } from "../application/Parameters";


export class Popup
{
    private impl:PopupControl;

    private setProtected(impl:PopupControl) : void
    {
        this.impl = impl;
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

    public getParameters() : Parameters
    {
        return(this.impl.getParameters());
    }

    public close() : void
    {
        this.impl.close();
    }
}