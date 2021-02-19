import { Utils } from "../utils/Utils";
import { Form, CallBack } from "./Form";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { FormInstance } from "./FormInstance";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class FormImpl
{
    private name:string;
    private path:string;
    private title: string;
    private win:ModalWindow;
    private inst:InstanceID;
    private parent:FormImpl;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
    private cancelled:boolean = false;
    private parameters:Map<string,any> = new Map<string,any>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();


    constructor(private form:any)
    {
        let utils:Utils = new Utils();
        this.name = utils.getName(form);
    }


    public getForm() : Form
    {
        return(this.form);
    }


    public setPath(path:string) : void
    {
        this.path = path;
    }


    public setTitle(title:string) : void
    {
        this.title = title;
    }


    public getApplication() : ApplicationImpl
    {
        return(this.app);
    }


    public setParent(parent:FormImpl) : void
    {
        this.parent = parent;
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public getInstanceID() : InstanceID
    {
        return(this.inst);
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
            id = this.app.getNewInstance(form);

            id.impl.setParent(this);
            id.impl.setParameters(parameters);

            this.stack.set(name,id);
        }

        let inst:FormInstance = this.app.getInstance(id);

        if (this.win != null)
        {
            this.win.newForm(inst);
            id.impl.display();
        }
        else
        {
            if (inst.windowdef != null) inst.windowopts = inst.windowdef;
            else                        inst.windowopts = {width: "", height: ""};

            this.app.showinstance(inst,parameters);
        }
    }


    private showTitle(title:string) : void
    {
        document.title = this.title;
    }


    private showPath(path:string) : void
    {
        let state = {additionalInformation: 'None'};
        let url:string = window.location.protocol + '//' + window.location.host;
        window.history.replaceState(state,this.name,url+path);
    }


    public display() : void
    {
        this.showTitle(this.title);
        if (this.parent == null) this.showPath(this.path);
    }


    public wasCancelled() : boolean
    {
        return(this.cancelled);
    }


    public cancel() : void
    {
        this.cancelled = true;
        this.close(true);
    }


    public onClose(impl:FormImpl) : void
    {
        if (this.callbackfunc == null) return;
        this.form[this.callbackfunc.name](impl.form);
    }


    public close(destroy?:boolean) : void
    {
        if (this.parent != null)
        {
            this.parent.display();
        }
        else
        {
            this.showPath("");
            this.showTitle("");
        }

        let pinst:InstanceID = null;
        if (this.parent != null) pinst = this.parent.getInstanceID();

        if (this.inst == null)
        {
            // Normal form behavior
            this.cancelled = false;
            this.app.closeform(this.form,destroy);
            return;
        }

        if (this.parent == null && pinst == null)
        {
            // Called from menu
            this.app.closeform(this.form,destroy);
            if (!this.cancelled) this.win.close();
        }

        if (this.parent != null && pinst == null)
        {
            // Window root form
            this.app.closeInstance(this.inst,destroy);
            if (destroy) this.parent.stack.delete(this.name);
            if (!this.cancelled) this.win.close();
        }

        if (this.parent != null && pinst != null)
        {
            // Form called from another form
            this.app.closeInstance(this.inst,destroy);
            if (destroy) this.parent.stack.delete(this.name);
        }

        if (this.cancelled)
        {
            this.cancelled = false;
            return;
        }

        if (pinst != null)
        {
            // Form called from another form
            let inst:FormInstance = this.app.getInstance(pinst);
            this.win.newForm(inst);
        }

        if (this.parent != null)
            this.parent.onClose(this);
    }


    public getCallStack() : Form[]
    {
        let stack:Form[] = [];

        this.stack.forEach((id) =>
        {
            stack.push(id.impl.getForm())
        });

        return(stack);
    }


    public clearStack() : void
    {
        this.stack.forEach((id) =>
        {
            id.impl.clearStack();

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