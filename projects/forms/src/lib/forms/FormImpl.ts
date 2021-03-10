import { Menu } from "../menu/Menu";
import { Utils } from "../utils/Utils";
import { Block } from "../blocks/Block";
import { Form, CallBack } from "./Form";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { BlockBase } from "../blocks/BlockBase";
import { DefaultMenu } from "../menu/DefaultMenu";
import { Container } from "../container/Container";
import { DropDownMenu } from "../menu/DropDownMenu";
import { BlockDefinition } from '../blocks/BlockDefinition';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { BlockDefinitions } from "../annotations/BlockDefinitions";
import { DatabaseUsage, DBUsage } from "../database/DatabaseUsage";
import { DatabaseDefinitions } from "../annotations/DatabaseDefinitions";


export class FormImpl
{
    private static id:number = 0;

    private menu$:Menu;
    private name$:string;
    private path$:string;
    private guid$:number;
    private title$:string;
    private root:FormImpl;
    private next:FormImpl;
    private win:ModalWindow;
    private inst:InstanceID;
    private parent:FormImpl;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
    private cancelled:boolean = false;
    private initiated$:boolean = false;
    private ddmenu:ComponentRef<DropDownMenu>;
    private parameters:Map<string,any> = new Map<string,any>();
    private blocks:Map<string,BlockBase> = new Map<string,BlockBase>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();


    constructor(private form$:Form)
    {
        this.guid$ = FormImpl.id++;
        let utils:Utils = new Utils();
        this.name$ = utils.getName(form$);
    }


    public get guid() : number
    {
        return(this.guid$);
    }


    public get form() : Form
    {
        return(this.form$);
    }


    public get name() : string
    {
        return(this.name$);
    }


    public set path(path:string)
    {
        this.path$ = path;
    }


    public get path() : string
    {
        return(this.path$);
    }


    public set title(title:string)
    {
        this.title$ = title;
    }


    public get title() : string
    {
        return(this.title$);
    }


    public getChain() : FormImpl
    {
        if (this.next == null) return(this);
        return(this.next.getChain());
    }


    public initiated(done?:boolean) : boolean
    {
        if (done != null) this.initiated$ = done;
        return(this.initiated$);
    }


    public newForm(container:Container) : void
    {
        let propusage:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>()

        DatabaseDefinitions.getBlockUsage(this.name).forEach((dbusage) =>
        {if (dbusage.usage != null) propusage.set(dbusage.prop,dbusage.usage);});

        let blockdef:BlockDefinition[] = BlockDefinitions.getBlocks(this.name);
        for(let i = 0; i < blockdef.length; i++) this.setDatabaseUsage(propusage,blockdef[i]);
    }


    private setDatabaseUsage(propusage:Map<string,DatabaseUsage>, blockdef:BlockDefinition) : void
    {
        let block:BlockBase = this.blocks.get(blockdef.alias);

        if (block != null)
        {
            window.alert("Block alias "+blockdef.alias+" defined twice");
            return;
        }

        if (blockdef.prop != null)
        {
            block = this.form[blockdef.prop];

            if (block == null && blockdef.component != null)
            {
                block = new blockdef.component();
                this.form[blockdef.prop] = block;
            }
        }
        else
        {
            if (blockdef.component != null)
                block = new blockdef.component();
        }

        if (block == null)
        {
            window.alert(this.name+" cannot create instance of "+blockdef.alias);
            return;
        }

        let alias:string = blockdef.alias;

        if (alias == null)
        {
            alias = block.constructor.name;
            alias = BlockDefinitions.getBlockDefaultAlias(alias);
        }

        alias = alias.toLowerCase();
        block["impl"].name = alias;
        this.blocks.set(alias,block);

        let bname:string = block.constructor.name;
        let usage:DatabaseUsage = DatabaseDefinitions.getBlockDefault(bname);

        usage = DBUsage.merge(blockdef.databaseopts,usage);
        usage = DBUsage.merge(propusage.get(blockdef.prop),usage);
        if (block instanceof Block) block.setDatabaseUsage(usage);
    }


    public setMenu(menu:Menu) : void
    {
        this.app.deletemenu(this.menu$);
        this.ddmenu = this.app.createmenu(menu);
        this.menu$ = menu;
    }


    public getMenu() : Menu
    {
        return(this.menu$);
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
        this.menu$ = new DefaultMenu();
        this.ddmenu = app.createmenu(this.menu$);
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
            this.replaceform(form,destroy,parameters);
        }
    }


    private replaceform(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(form);
        let id:InstanceID = this.parent.stack.get(name);

        // newform
        if (id != null && destroy)
        {
            id = null;
            this.app.closeform(this,destroy);
        }

        // create
        if (id == null)
        {
            id = this.app.getNewInstance(form);
            this.parent.stack.set(id.name,id);
        }

        this.parent.next = id.impl;
        id.impl.setParent(this.parent);

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
            this.app.showinstance(inst);
        }
    }


    public callForm(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(form);
        let id:InstanceID = this.stack.get(name);

        // newform
        if (id != null && destroy)
        {
            id = null;
            this.app.closeform(form,destroy);
        }

        // create
        if (id == null)
        {
            id = this.app.getNewInstance(form);
            this.stack.set(name,id);
        }

        this.next = id.impl;
        id.impl.setParent(this);

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
        this.next = null;

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

        this.next = null;

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
                this.app.showTitle(this.root.title);
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
            this.win.closeWindow();
            return;
        }

        //child closed
        this.app.closeInstance(this.inst,destroy);
        if (destroy) this.parent.stack.delete(this.name);

        let pinst:InstanceID = this.parent.getInstanceID();
        this.app.showTitle(this.parent.title);

        if (pinst != null)
        {
            //Parent is modal
            let inst:FormInstance = this.app.getInstance(pinst);
            this.win.newForm(inst);
            return;
        }

        this.win.closeWindow();
    }


    public getCallStack() : Form[]
    {
        let stack:Form[] = [];

        this.stack.forEach((id) =>
        {
            stack.push(id.impl.form)
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