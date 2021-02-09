import { Parameters } from "../application/Parameters";
import { ApplicationImpl } from "../application/ApplicationImpl";

export class FormImpl
{
    private app:ApplicationImpl;

    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
    }

    public getParameters(component:any) : Parameters
    {
        return(this.app.getParameters(component));
    }
}