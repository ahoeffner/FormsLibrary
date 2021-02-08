import { FormImpl } from "./FormImpl";

export class Form
{
    private impl:FormImpl;

    constructor()
    {
        this.impl = new FormImpl();
    }

    private getImplementation() : FormImpl
    {
        return(this.impl);
    }
}