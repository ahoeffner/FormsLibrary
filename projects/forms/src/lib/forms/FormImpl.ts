import { ModalWindow } from "./ModalWindow";
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private win:ModalWindow;
    private inst:InstanceID;
    private app:ApplicationImpl;


    constructor(private form:any) {}


    public getApplication() : ApplicationImpl
    {
        return(this.app);
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public setInstanceID(inst:InstanceID) : void
    {
        this.inst = inst;
    }


    public setModalWindow(win:ModalWindow) : void
    {
        this.win = win;
    }


    public getModalWindow() : ModalWindow
    {
        return(this.win);
    }


    public callForm(form:any) : void
    {
        let id:InstanceID = this.app.getNewInstance(form);
        let inst:FormInstance = this.app.getInstance(id);

        if (this.win != null)
        {
            this.win.newForm(inst);
        }
        else
        {
            inst.modalopts = {width: 0, height: 0};
            this.app.showinstance(inst);
        }
    }


    public getParameters() : Map<string,any>
    {
        return(null);
    }


    public close(dismiss?:boolean) : void
    {
        if (this.win != null) this.win.close();

        if (this.inst == null) this.app.closeform(this.form,dismiss);
        else this.app.closeInstance(this.inst,true);
    }
}