import { PopupImpl } from "./PopupImpl";


export class PopupWrapper
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

    public setPosition(top:number, left:number)
    {
        this.impl.top = top;
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
}