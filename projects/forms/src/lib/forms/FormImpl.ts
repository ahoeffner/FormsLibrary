import { Menu } from "../menu/Menu";
import { Utils } from "../utils/Utils";
import { Block } from "../blocks/Block";
import { Form, CallBack } from "./Form";
import { Record } from "../blocks/Record";
import { KeyMap } from "../keymap/KeyMap";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { BlockImpl } from "../blocks/BlockImpl";
import { TableData } from "../blocks/TableData";
import { DefaultMenu } from "../menu/DefaultMenu";
import { Container } from "../container/Container";
import { DropDownMenu } from "../menu/DropDownMenu";
import { FieldInstance } from "../input/FieldInstance";
import { EventListener } from "../events/EventListener";
import { FieldDefinition } from "../input/FieldDefinition";
import { BlockDefinition } from '../blocks/BlockDefinition';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { BlockDefinitions } from "../annotations/BlockDefinitions";
import { DatabaseUsage, DBUsage } from "../database/DatabaseUsage";
import { FieldDefinitions } from "../annotations/FieldDefinitions";
import { DatabaseDefinitions } from "../annotations/DatabaseDefinitions";


export class FormImpl implements EventListener
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
    private block$:BlockImpl;
    private app:ApplicationImpl;
    private callbackfunc:CallBack;
    private blocks:BlockImpl[] = [];
    private cancelled:boolean = false;
    private initiated$:boolean = false;
    private fields$:FieldInstance[] = [];
    private ddmenu:ComponentRef<DropDownMenu>;
    private parameters:Map<string,any> = new Map<string,any>();
    private stack:Map<string,InstanceID> = new Map<string,InstanceID>();
    private blkindex:Map<string,BlockImpl> = new Map<string,BlockImpl>();


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


    public get block() : BlockImpl
    {
        return(this.block$);
    }


    public set block(block:BlockImpl)
    {
        if (this.block != null && this.block != block)
            if (!this.block.validate()) return;
        this.block$ = block;
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


    public newForm(container:Container) : void
    {
        // Create blocks
        let blockdef:BlockDefinition[] = BlockDefinitions.getBlocks(this.name);
        blockdef.forEach((bdef) => {this.createBlock(bdef)});

        // DatabaseUsage for this form
        let fusage:DatabaseUsage = DatabaseDefinitions.getFormUsage(this.name);

        // DatabaseUsage for DATABASE anotated form properties
        let propusage:Map<string,DatabaseUsage> = DatabaseDefinitions.getBlockUsage(this.name);

        // Merge default, block-spec and prop usage. Form usage overides
        blockdef.forEach((bdef) =>
        {
            let usage:DatabaseUsage = propusage.get(bdef.prop);
            this.setBlockUsage(fusage,usage,bdef);
        });

        container.finish();
        container.getBlocks().forEach((cb) =>
        {
            let block:BlockImpl = this.blkindex.get(cb.name);

            if (block == null)
            {
                window.alert("Form has fields bound to "+cb.name+" that doesn't exist");
                return;
            }

            block.config = this.app.conf;

            cb.records.forEach((rec) =>
            {block.addRecord(new Record(rec.row,rec.fields,rec.index))});

            let fielddef:Map<string,FieldDefinition> = FieldDefinitions.getFieldIndex(block.clazz);
            cb.fields.forEach((inst) =>
            {
                let def:FieldDefinition = fielddef.get(inst.name);

                if (def != null) inst.type = def.type;
                else window.alert("Field "+inst.name+" has no correponding definition");
            });
        });

        this.blkindex.forEach((block) =>
        {
            let rec:Record = block.getRecord(0);

            if (rec != null)
            {
                rec.enable(true);
                rec.current = true;

                let columns:string[] = [];
                let fielddef:FieldDefinition[] = FieldDefinitions.getFields(block.clazz);
                fielddef.forEach((col) => {columns.push(col.name)});

                block.table = new TableData(null,block.getDatabaseUsage(),columns);
                block.display(0);
            }
        });

        // All fields on form
        this.fields$ = container.fields;
        this.rehash();
    }


    public showform(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        if (!this.validate())
            return;

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

        this.onHide();

        // newform
        if (destroy)
            this.app.closeform(this,destroy);

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


    public callform(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(form);
        let id:InstanceID = this.stack.get(name);

        this.onHide();

        // newform
        if (id != null && destroy)
        {
            this.app.closeform(id.impl,destroy);
            id = null;
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

        if (!this.cancelled && !destroy && !this.validate())
            return;

        this.next = null;

        if (this.parent != null)
            this.parent.onClose(this,this.cancelled);

        if (this.cancelled)
        {
            this.cancelled = false;

            if (menu)
            {
                //chain, started from "menu", was cancelled
                this.app.closeform(this,true);
            }
            else
            {
                //chain, started from form, was cancelled
                this.parent.stack.delete(this.name);
                this.app.closeInstance(this.inst,true);
                this.app.showTitle(this.root.title);
            }

            if (!menu)
                this.root.onShow();

            return;
        }

        if (!win)
        {
            //Normal behaivior
            this.app.closeform(this,destroy);
            if (!root) this.parent.onShow();
            return;
        }

        if (win && root)
        {
            //Root window
            this.app.closeform(this,destroy);
            if (!root) this.parent.onShow();
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
        }
        else this.win.closeWindow();

        this.parent.onShow();
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


    private createBlock(blockdef:BlockDefinition) : void
    {
        let impl:BlockImpl = this.blkindex.get(blockdef.alias);

        if (impl != null)
        {
            window.alert("Block alias "+blockdef.alias+" defined twice");
            return;
        }

        let block:Block = null;

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

        if (block != null)
            impl = block["_impl_"];

        if (impl == null)
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

        impl.name = alias;
        blockdef.alias = alias;
        this.blocks.push(impl);
        this.blkindex.set(alias,impl);

        impl.parent = this;
        impl.setApplication(this.app);
    }


    private setBlockUsage(formusage:DatabaseUsage, propusage:DatabaseUsage, blockdef:BlockDefinition) : void
    {
        let block:BlockImpl = this.blkindex.get(blockdef.alias);
        let bname:string = block.clazz;

        if (!(block instanceof BlockImpl))
        {
            window.alert(bname+" is not a block");
            return;
        }

        let usage1:DatabaseUsage = DatabaseDefinitions.getBlockDefault(bname);
        let usage2:DatabaseUsage = blockdef.databaseopts;
        let usage3:DatabaseUsage = propusage;
        let usage4:DatabaseUsage = formusage;
        let usage5:DatabaseUsage = {};

        if (usage1 == null) usage1 = {};
        if (usage2 == null) usage2 = {};
        if (usage3 == null) usage3 = {};
        if (usage4 == null) usage4 = {};

        usage5 = DBUsage.merge(usage2,usage1);
        usage5 = DBUsage.merge(usage3,usage5);
        usage5 = DBUsage.override(usage4,usage5);
        usage5 = DBUsage.complete(usage5);

        block.setDatabaseUsage(usage5);
    }


    public rehash(groups?:string[]) : void
    {
        let seq:number = 1;
        if (groups == null) groups = [];

        let index:Map<string,FieldInstance[]> = new Map<string,FieldInstance[]>();

        this.fields$.forEach((field) =>
        {
            let group:FieldInstance[] = index.get(field.group);

            if (group == null)
            {
                group = [];
                index.set(field.group,group);

                let exists:boolean = false;
                for(let i = 0; i < groups.length; i++)
                {
                    if (groups[i] == field.group)
                    {
                        exists = true;
                        break;
                    }
                }

                if (!exists) groups.push(field.group);
            }

            group.push(field);
        });

        groups.forEach((name) =>
        {
            let group:FieldInstance[] = index.get(name);
            if (group != null) {group.forEach((field) => {field.seq = seq++});}
        });

        this.fields$ = this.fields$.sort((a,b) => {return(a.seq - b.seq)});
        this.fields$[0].focus();
    }


    public validate() : boolean
    {
        if (this.block == null) return(true);
        else return(this.block.validate());
    }


    public onShow() : void
    {
    }


    public onHide() : void
    {
    }


    public sendkey(event:any,key:string) : void
    {
        this.block.sendkey(event,key);
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string)
    {
        if (this.app == null)
            return;

        let keymap:KeyMap = this.app.conf.keymap;

        if (type == "focus")
            this.block = this.blkindex.get(field.block);

        if (type == "key" && key == keymap.prevfield)
        {
            let prev:boolean = false;

            // seq 1 -> fields.length
            for(let i = field.seq - 1; i > 0; i--)
            {
                if (this.fields$[i-1].enabled)
                {
                    prev = true;
                    break;
                }
            }

            if (!prev) event.preventDefault();
            return;
        }

        if (type == "key" && key == keymap.nextfield)
        {
            let next:boolean = false;

            // seq 1 -> fields.length
            for(let i = field.seq; i < this.fields$.length; i++)
            {
                if (this.fields$[i].enabled)
                {
                    next = true;
                    break;
                }
            }

            if (!next) event.preventDefault();
            return;
        }
    }
 }