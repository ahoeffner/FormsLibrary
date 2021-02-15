import { FormImpl } from "./FormImpl";

export interface CallBack
{
    (form:Form) : void;
}



export class Form
{
    private impl:FormImpl;
    private callbackfunc:CallBack;


    constructor()
    {
        this.impl = new FormImpl(this);
    }

    private _getProtected() : FormImpl
    {
        return(this.impl);
    }

    public callForm(form:any, parameters?:Map<string,any>) : void
    {
        this.impl.callForm(form,parameters);
    }

    public getCallStack() : Form[]
    {
        return(this.impl.getCallStack());
    }

    public getParameters() : Map<string,any>
    {
        return(this.impl.getParameters());
    }

    public wasCancelled() : boolean
    {
        return(this.impl.wasCancelled());
    }

    public close(dismiss?:boolean) : void
    {
        this.impl.close(dismiss);
    }

    public setCallback(func:CallBack) : void
    {
        this.callbackfunc = func;
    }

    private _callback(form:any) : void
    {
        if (this.callbackfunc == null) return;
        this[this.callbackfunc.name](form);
    }
}