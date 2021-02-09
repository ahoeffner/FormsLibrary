import { FormImpl } from "./FormImpl";
import { Parameters } from "../application/Parameters";


export class Form
{
    private impl:FormImpl;

    constructor()
    {
        this.impl = new FormImpl();
    }

    private getProtected() : FormImpl
    {
        return(this.impl);
    }

    public getParameters(component?:any) : Parameters
    {
        if (component == null) component = this;
        return(this.impl.getParameters(component));
    }
}