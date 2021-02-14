import { FormImpl } from "./FormImpl";


export class Form
{
    private impl:FormImpl;

    constructor()
    {
        this.impl = new FormImpl(this);
    }

    private getProtected() : FormImpl
    {
        return(this.impl);
    }

    public callForm(form:any) : void
    {
        this.impl.callForm(form);
    }

    public getParameters() : Map<string,any>
    {
        return(this.impl.getParameters());
    }


    public close(dismiss?:boolean) : void
    {
        this.impl.close(dismiss);
    }
}