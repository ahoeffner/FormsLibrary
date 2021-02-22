import { Menu } from "../menu/Menu";
import { Utils } from "../utils/Utils";
import { Form, CallBack } from "./Form";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { MenuFactory } from "../menu/MenuFactory";
import { DropDownMenu } from "../menu/DropDownMenu";
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
    private menu:ComponentRef<DropDownMenu>;
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


    public init() : void
    {
        this.form.init();
    }


    public start() : void
    {
        this.app.showTitle(this.title);

        if (this.parent == null)
            this.app.showPath(this.name,this.path);

        this.form.start();
    }


    public setMenu(menu:Menu) : void
    {
        let factory:MenuFactory = new MenuFactory(this.app.builder);
        this.menu = factory.create(menu);
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
        if (params != null) this.parameters = params;
        else this.parameters = new Map<string,InstanceID>();
    }


    public getParameters() : Map<string,any>
    {
        return(this.parameters);
    }


    public getMenu() : ComponentRef<DropDownMenu>
    {
        if (this.menu != null) return(this.menu);
        return(this.app.getDefaultMenu());
    }


    public showform(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        if (this.win == null)
        {
            this.app.showform(form,destroy,parameters);
        }
        else
        {
            this.callForm(form,destroy,true,parameters);
        }
    }


    public callForm(form:any, destroy:boolean, replace:boolean, parameters?:Map<string,any>) : void
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(form);
        let id:InstanceID = this.stack.get(name);

        if (id != null && destroy)
        {
            id = null;
            this.app.closeform(form,destroy);
        }

        if (id == null)
        {
            id = this.app.getNewInstance(form);

            if (!replace) id.impl.setParent(this);
            else   id.impl.setParent(this.parent);

            id.impl.setParameters(parameters);
            this.stack.set(name,id);
        }

        let inst:FormInstance = this.app.getInstance(id);

        if (this.win != null)
        {
            this.win.newForm(inst);
            id.impl.start();
        }
        else
        {
            if (inst.windowdef != null) inst.windowopts = inst.windowdef;
            else                        inst.windowopts = {width: "", height: ""};

            this.app.showinstance(inst,parameters);
        }
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


    public onClose(impl:FormImpl,cancelled:boolean) : void
    {
        try
        {
            if (this.callbackfunc != null)
                this.form[this.callbackfunc.name](impl.form,cancelled);
        }
        catch (error)
        {
            console.log(error);
        }

        if (cancelled && this.parent != null)
            this.parent.onClose(this,cancelled);
    }


    public close(destroy?:boolean) : void
    {
        if (this.parent != null)
        {
            this.parent.start();
        }
        else
        {
            this.app.showPath("","");
            this.app.showTitle(null);
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

        if (pinst != null && !this.cancelled)
        {
            // Form called from another form
            let inst:FormInstance = this.app.getInstance(pinst);
            this.win.newForm(inst);
        }

        if (this.parent != null)
            this.parent.onClose(this,this.cancelled);
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