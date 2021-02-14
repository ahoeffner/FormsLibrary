import { Utils } from "../utils/Utils";
import { ModalWindow } from "./ModalWindow";
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private win:ModalWindow;
    private inst:InstanceID;
    private app:ApplicationImpl;
    private parameters:Map<string,any> = new Map<string,any>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();


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


    public setParameters(params:Map<string,any>) : void
    {
        this.parameters = params;
    }


    public getParameters() : Map<string,any>
    {
        return(this.parameters);
    }


    public callForm(form:any, parameters?:Map<string,any>) : void
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(form);
        let id:InstanceID = this.stack.get(name);

        if (id == null)
        {
            id = this.app.getNewInstance(form);
            this.stack.set(name,id);
        }

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
    }


    public close(dismiss?:boolean) : void
    {
        if (this.win != null) this.win.close();

        if (this.inst == null) this.app.closeform(this.form,dismiss);
        else this.app.closeInstance(this.inst,dismiss);
    }


    public clearStack() : void
    {
        this.stack.forEach((id) =>
        {
            if (id.ref != null)
                this.app.closeInstance(id,true);
        });

        this.stack.clear();
    }
}