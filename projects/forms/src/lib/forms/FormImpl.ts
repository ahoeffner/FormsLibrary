import { Form } from "./Form";
import { Utils } from "../utils/Utils";
import { ModalWindow } from "./ModalWindow";
import { Protected } from "../utils/Protected";
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private parent:FormImpl;
    private win:ModalWindow;
    private inst:InstanceID;
    private app:ApplicationImpl;
    private cancelled:boolean = false;
    private parameters:Map<string,any> = new Map<string,any>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();


    constructor(private form:any) {}


    public getForm() : Form
    {
        return(this.form);
    }


    public getApplication() : ApplicationImpl
    {
        return(this.app);
    }


    public setParent(form:FormImpl) : void
    {
        this.parent = form;
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
            id.form.setParent(this);
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


    public wasCancelled() : boolean
    {
        return(this.cancelled);
    }


    public cancel(dismiss?:boolean) : void
    {
        this.cancelled = true;
        this.close(dismiss);
    }


    public onClose(impl:FormImpl) : void
    {
        Protected.callback(this.form,impl.form);
    }


    public close(dismiss?:boolean) : void
    {
        if (this.win != null) this.win.close();

        if (this.inst == null) this.app.closeform(this.form,dismiss);
        else this.app.closeInstance(this.inst,dismiss);

        if (this.parent != null) this.parent.onClose(this);
    }


    public getCallStack() : Form[]
    {
        let stack:Form[] = [];

        this.stack.forEach((id) =>
        {
            stack.push(id.form.getForm())
        });

        return(stack);
    }


    public clearStack() : void
    {
        this.stack.forEach((id) =>
        {
            id.form.clearStack();

            if (id.ref != null)
                this.app.closeInstance(id,true);
        });

        this.stack.clear();
    }
}