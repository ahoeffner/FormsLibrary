import { PopupControl } from "./PopupControl";
import { Parameters } from "../application/Parameters";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class Popup
{
    private ctrl:PopupControl;
    private app:ApplicationImpl;

    private setProtected(parent:any) : void
    {
        if (parent instanceof PopupControl) this.ctrl = parent;
        if (parent instanceof ApplicationImpl) this.app = parent;
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

    public getParameters(component?:any) : Parameters
    {
        if (component == null) component = this;
        return(this.app.getParameters(component));
    }

    public close() : void
    {
        this.ctrl.close();
    }
}