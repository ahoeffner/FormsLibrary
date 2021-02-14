import { ModalWindow } from "./ModalWindow";
import { StackElement } from "./StackElement";
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private win:ModalWindow;
    private inst:InstanceID;
    private app:ApplicationImpl;
    private stack:StackElement[];
    private parameters:Map<string,any> = new Map<string,any>();


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


    public setStack(stack:StackElement[]) : void
    {
        this.stack = stack;
    }


    public getStack() : StackElement[]
    {
        return(this.stack);
    }


    public getModalWindow() : ModalWindow
    {
        return(this.win);
    }


    public setParameters(params:Map<string,any>) : void
    {
        this.parameters = params;
    }


    public getParameters() : Map<string,any>
    {
        return(this.parameters);
    }


    public callForm(form:any, parameters?:Map<string,any>) : InstanceID
    {
        let id:InstanceID = this.app.getNewInstance(form);
        let inst:FormInstance = this.app.getInstance(id);

        if (this.win != null)
        {
            this.win.newForm(inst,parameters);
        }
        else
        {
            inst.modalopts = {width: 0, height: 0};
            this.app.showinstance(inst,parameters);
        }

        return(id);
    }


    public close(dismiss?:boolean) : void
    {
        if (this.win != null) this.win.close();

        if (this.inst == null) this.app.closeform(this.form,dismiss);
        else this.app.closeInstance(this.inst,true);
    }
}