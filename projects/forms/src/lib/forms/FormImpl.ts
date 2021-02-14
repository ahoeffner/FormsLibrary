import { Utils } from "../utils/Utils";
import { ModalWindow } from "./ModalWindow";
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private win:ModalWindow;
    private inst:InstanceID;
    private app:ApplicationImpl;
    private stack:Map<string,any> = new Map<string,any>();
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
        let inst:FormInstance = this.stack.get(name);

        if (inst == null)
        {
            let id:InstanceID = this.app.getNewInstance(form);
            inst = this.app.getInstance(id);
            this.stack.set(name,inst);
        }

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
}