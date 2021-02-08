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

    public close() : void
    {
        this.impl.close();
    }
}