import { FormImpl } from "./FormImpl";
import { Parameters } from "../application/Parameters";


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

    public getParameters(component?:any) : Parameters
    {
        return(this.impl.getParameters(component));
    }


    public close(dismiss?:boolean) : void
    {
        this.impl.close(dismiss);
    }
}