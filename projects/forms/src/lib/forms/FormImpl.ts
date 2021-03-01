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
    private title:string;
    private root:FormImpl;
    private win:ModalWindow;
    private inst:InstanceID;
    private parent:FormImpl;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
    private cancelled:boolean = false;
    private initiated$:boolean = false;
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


    public getName() : string
    {
        return(this.name);
    }


    public setPath(path:string) : void
    {
        this.path = path;
    }


    public getPath() : string
    {
        return(this.path);
    }


    public setTitle(title:string) : void
    {
        this.title = title;
    }


    public getTitle() : string
    {
        return(this.title);
    }


    public initiated(done?:boolean) : boolean
    {
        if (done != null) this.initiated$ = done;
        return(this.initiated$);
    }


    public setBlockDefinitions() : void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.getBlocks(this.name);
        if (blocks == null) return;

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


    public setRoot(root:FormImpl) : void
    {
        this.root = root;
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

            this.stack.set(name,id);
        }

        let inst:FormInstance = this.app.getInstance(id);
        this.app.preform(id.impl,parameters,inst,false);

        if (this.win != null)
        {
            this.win.newForm(inst);
            id.impl.setRoot(this.root);
        }
        else
        {
            id.impl.setRoot(this);

            if (inst.windowdef != null) inst.windowopts = inst.windowdef;
            else                        inst.windowopts = {width: "", height: ""};

            this.app.showinstance(inst);
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
        let win:boolean = (this.win != null);
        let menu:boolean = (this.root == null);
        let root:boolean = (this.parent == null);

        if (this.parent != null)
            this.parent.onClose(this,this.cancelled);

        if (this.cancelled)
        {
            this.cancelled = false;

            if (menu)
            {
                //chain, started from menu, was cancelled
                this.app.closeform(this,true);
            }
            else
            {
                //chain, started from form, was cancelled
                this.parent.stack.delete(this.name);
                this.app.closeInstance(this.inst,true);
            }

            return;
        }

        if (!win)
        {
            //Normal behaivior
            this.app.closeform(this,destroy);
            return;
        }

        if (win && root)
        {
            //Root window
            this.app.closeform(this,destroy);
            this.win.close();
            return;
        }

        //child closed
        this.app.closeInstance(this.inst,destroy);
        if (destroy) this.parent.stack.delete(this.name);

        let pinst:InstanceID = null;
        if (this.parent != null) pinst = this.parent.getInstanceID();

        if (pinst != null)
        {
            //Parent is modal
            let inst:FormInstance = this.app.getInstance(pinst);
            this.win.newForm(inst);
            return;
        }

        this.win.close();
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