import { Parameters } from "../application/Parameters";
import { ApplicationImpl } from "../application/ApplicationImpl";

export class FormImpl
{
    private params:Parameters;
    private app:ApplicationImpl;

    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
    }

    public setParams(params:Parameters) : void
    {
        this.params = params;
    }

    public getParameters(component?:string) : Parameters
    {
        if (component == null) return(this.params);
        else return(this.app.getParams(component));
    }
}