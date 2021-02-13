import { ModalWindow } from "./ModalWindow";
import { Parameters } from "../application/Parameters";
import { ApplicationImpl } from "../application/ApplicationImpl";

export class FormImpl
{
    private win:ModalWindow;
    private app:ApplicationImpl;


    public getApplication() : ApplicationImpl
    {
        return(this.app);
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public setModal(win:ModalWindow) : void
    {
        this.win = win;
    }


    public getParameters(component:any) : Parameters
    {
        return(this.app.getParameters(component));
    }
}