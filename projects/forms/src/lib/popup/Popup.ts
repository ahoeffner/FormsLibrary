import { PopupImpl } from "./PopupImpl";


export class Popup
{
    private impl:PopupImpl;

    constructor(component:any)
    {
        this.impl = new PopupImpl(component);
    }

    private getImplementation() : PopupImpl
    {
        return(this.impl);
    }

    public set Top(top:number)
    {
        this.impl.top = top;
    }

    public set Left(left:number)
    {
        this.impl.left = left;
    }

    public set Width(width:string)
    {
        this.impl.width = width;
    }

    public set Height(height:string)
    {
        this.impl.height = height;
    }

    public set Title(title:string)
    {
        this.impl.title = title;
    }

    public close() : void
    {
        this.impl.close();
    }
}