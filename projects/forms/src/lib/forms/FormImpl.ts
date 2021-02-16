import { Utils } from "../utils/Utils";
import { Form, CallBack } from "./Form";
import { ModalWindow } from "./ModalWindow";
import { Protected } from "../utils/Protected";
import { BlockDefinition } from '../blocks/BlockDefinition';
import { InstanceID, FormInstance } from "./FormsDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private win:ModalWindow;
    private inst:InstanceID;
    private parent:InstanceID;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
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


    public setParent(parent:InstanceID) : void
    {
        this.parent = parent;
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


    public setCallback(func:CallBack) : void
    {
        this.callbackfunc = func;
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
            let inst:InstanceID = this.inst;

            if (inst == null)
            {
                console.log("create inst");
            }

            id = this.app.getNewInstance(form);
            id.form.setParent(inst);

            let impl:FormImpl = Protected.get(id.ref.instance);
            impl.setParameters(parameters);

            this.stack.set(name,id);
        }

        let inst:FormInstance = this.app.getInstance(id);

        if (this.win != null)
        {
            this.win.newForm(inst);
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
        if (this.inst != null && this.win != null)
        {
            let inst:FormInstance = this.app.getInstance(this.inst);
            this.win.newForm(inst);
        }

        if (this.callbackfunc == null) return;
        this.form[this.callbackfunc.name](impl.form);
    }


    public close(dismiss?:boolean) : void
    {
        if (this.win != null && this.parent == null) this.win.close();

        if (this.inst == null) this.app.closeform(this.form,dismiss);
        else this.app.closeInstance(this.inst,dismiss);

        if (this.parent != null) this.parent.form.onClose(this);
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


    public setBlock(vname:string, alias:string) : void
    {
        console.log("use "+alias+" for "+vname);
    }
}