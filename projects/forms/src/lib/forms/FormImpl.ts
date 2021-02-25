import { Menu } from "../menu/Menu";
import { Utils } from "../utils/Utils";
import { Block } from "../blocks/Block";
import { Form, CallBack } from "./Form";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { DefaultMenu } from "../menu/DefaultMenu";
import { DropDownMenu } from "../menu/DropDownMenu";
import { BlockDefinition } from '../annotations/BlockDefinition';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { BlockDefinitions } from "../annotations/BlockDefinitions";


export class FormImpl
{
    private menu:Menu;
    private name:string;
    private path:string;
    private title: string;
    private win:ModalWindow;
    private inst:InstanceID;
    private parent:FormImpl;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
    private cancelled:boolean = false;
    private ddmenu:ComponentRef<DropDownMenu>;
    private parameters:Map<string,any> = new Map<string,any>();
    private blocks:Map<string,Block> = new Map<string,Block>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();


    constructor(private form:Form)
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


    public onInit() : void
    {
        this.form.onInit();
    }


    public onStart() : void
    {
        this.app.showTitle(this.title);

        if (this.parent == null)
            this.app.showPath(this.name,this.path);

        this.form.onStart();
    }


    public setBlockDefinitions() : void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.getBlocks(this.name);

        for(let i = 0; i < blocks.length; i++)
        {
            let block:Block = this.blocks.get(blocks[i].alias);
            if (block) window.alert("Block alias "+blocks[i].alias+" defined twice");

            if (blocks[i].prop != null) block = this.form[blocks[i].prop];
            else if (blocks[i].component != null) block = new blocks[i].component();

            if (block == null) window.alert("Cannot create instance of "+blocks[i].alias);
            this.blocks.set(blocks[i].alias,block);
        }
    }


    public setMenu(menu:Menu) : void
    {
        this.menu = menu;
        this.ddmenu = this.app.createmenu(menu);
    }


    public getMenu() : Menu
    {
        return(this.menu);
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


    public getDropDownMenu() : ComponentRef<DropDownMenu>
    {
        if (this.ddmenu != null) return(this.ddmenu);
        this.setMenu(new DefaultMenu());
        return(this.ddmenu);
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
            id.impl.onStart();
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
            this.parent.onStart();
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
            this.win = null;
        }

        if (this.parent != null && pinst == null)
        {
            // Window root form
            this.app.closeInstance(this.inst,destroy);
            if (destroy) this.parent.stack.delete(this.name);
            if (!this.cancelled) this.win.close();
            this.win = null;
        }

        if (this.parent != null && pinst != null)
        {
            // Form called from another form
            this.app.closeInstance(this.inst,destroy);
            if (destroy) this.parent.stack.delete(this.name);
            if (this.cancelled) this.win = null;
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