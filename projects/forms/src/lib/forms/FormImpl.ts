import { Key } from "../blocks/Key";
import { Menu } from "../menu/Menu";
import { Utils } from "../utils/Utils";
import { Block } from "../blocks/Block";
import { Form, CallBack } from "./Form";
import { Table } from "../database/Table";
import { Record } from "../blocks/Record";
import { keymap } from "../keymap/KeyMap";
import { InstanceID } from "./InstanceID";
import { ModalWindow } from "./ModalWindow";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { BlockImpl } from "../blocks/BlockImpl";
import { FieldData } from "../blocks/FieldData";
import { MessageBox } from "../popup/MessageBox";
import { Statement } from "../database/Statement";
import { DefaultMenu } from "../menu/DefaultMenu";
import { Container } from "../container/Container";
import { Connection } from "../database/Connection";
import { DropDownMenu } from "../menu/DropDownMenu";
import { FieldInstance } from "../input/FieldInstance";
import { Trigger, Triggers } from "../events/Triggers";
import { FieldImplementation } from "../input/FieldType";
import { FieldDefinition } from "../input/FieldDefinition";
import { BlockDefinition } from '../blocks/BlockDefinition';
import { TriggerFunction } from "../events/TriggerFunction";
import { KeyDefinition } from "../annotations/KeyDefinition";
import { TableDefinition } from "../database/TableDefinition";
import { ColumnDefinition } from "../database/ColumnDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { BlockDefinitions } from "../annotations/BlockDefinitions";
import { DatabaseUsage, DBUsage } from "../database/DatabaseUsage";
import { FieldDefinitions } from "../annotations/FieldDefinitions";
import { TableDefinitions } from "../annotations/TableDefinitions";
import { ColumnDefinitions } from "../annotations/ColumnDefinitions";
import { KeyTriggerEvent, TriggerEvent } from "../events/TriggerEvent";
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
    private conn:Connection;
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
    private triggers:Triggers = new Triggers();
    private keys:Map<string,Key> = new Map<string,Key>();
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


    public get popup() : boolean
    {
        return(this.win != null);
    }


    public getCurrentRow(block:string) : number
    {
        let blk:BlockImpl = this.getBlock(block);
        if (blk == null) return(0);
        return(blk.row);
    }


    public getCurrentRecord(block:string) : number
    {
        let blk:BlockImpl = this.getBlock(block);
        if (blk == null) return(0);
        return(blk.record);
    }


    public getBlock(bname:string)
    {
        return(this.blkindex.get(bname.toLowerCase()));
    }


    public clear() : void
    {
        this.blocks.forEach((block) => {block.clear()});
        if (this.blocks.length > 0) this.block = this.blocks[0];
        this.block?.focus();
    }


    public focus() : void
    {
        this.block?.focus();
    }


    public set block(block:BlockImpl)
    {
        if (this.block != null && this.block != block)
            if (!this.block?.validate()) return;
        this.block$ = block;
    }


    public getChain() : FormImpl
    {
        if (this.next == null) return(this);
        return(this.next.getChain());
    }


    public initiated() : boolean
    {
        return(this.initiated$);
    }


    public setMenu(menu:Menu) : void
    {
        if (this.app == null)
        {
            this.menu$ = menu;
            return;
        }

        this.app.deletemenu(this.menu$);
        this.ddmenu = this.app.createmenu(menu);
        this.app.showMenu(this.ddmenu);
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

        if (this.menu$ == null)
            this.menu$ = new DefaultMenu();

        this.conn = app.appstate.connection;
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


    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        let response:any = await this.app.appstate.connection.invokestmt(stmt);

        if (response["status"] == "failed")
            this.alert(JSON.stringify(response),"Execute SQL Failed");

        let rows:any[] = response["rows"];

        if (rows == null)
        {
            if (firstcolumn) return(null);
            return([]);
        }

        if (!firstrow) return(rows);

        let row:any = [];
        if (rows.length > 0) row = rows[0];

        if (!firstcolumn) return(row);

        let columns:string[] = Object.keys(row);
        if (columns.length == 0) return(null);

        return(row[columns[0]]);
    }


    public newForm(container:Container) : void
    {
        // Create blocks
        let blockdef:BlockDefinition[] = BlockDefinitions.getBlocks(this.name);
        blockdef.forEach((bdef) => {this.createBlock(bdef)});

        // DatabaseUsage for this form
        let fusage:DatabaseUsage = DatabaseDefinitions.getFormUsage(this.name);

        // Merge form, block and block usage. Form usage overides
        blockdef.forEach((bdef) => {this.setBlockUsage(fusage,bdef);});

        container.finish();

        // Hold all fields per block
        let bfields:Map<string,FieldInstance[]> = new Map<string,FieldInstance[]>();

        container.getBlocks().forEach((cb) =>
        {
            let block:BlockImpl = this.blkindex.get(cb.name);

            if (block == null)
            {
                let dblk = new Block();
                block = dblk["_impl_"];

                this.blocks.push(block);
                this.blkindex.set(cb.name,block);

                block.form = this;
                block.alias = cb.name;
                block.setApplication(this.app);

                console.log("Block "+cb.name+" auto-created");
            }

            bfields.set(block.alias,cb.fields);

            cb.records.forEach((rec) =>
            // Copy records from container
            {block.addRecord(new Record(rec.row,rec.fields,rec.index))});
        });

        this.blkindex.forEach((block) =>
        {
            // Finish setup for each block
            let tabdef:TableDefinition = TableDefinitions.get(block.clazz);
            let keys:KeyDefinition[] = BlockDefinitions.getKeys(block.clazz);

            // Column definitions
            let colindex:Map<string,ColumnDefinition> = ColumnDefinitions.getIndex(block.clazz);

            // Create keys and decide on primary
            let pkey:Key = null;
            keys.forEach((kdef) =>
            {
                let key:Key = this.keys.get(kdef.name);

                if (key == null)
                {
                    key = new Key(kdef.name);
                    this.keys.set(kdef.name,key);

                    kdef.columns.forEach((col) =>
                    {
                        if (colindex.get(col) != null) key.add(col);
                        else console.log("key "+kdef.name+" column "+col+" is not a column, ignored");
                    });

                    if (kdef.unique && pkey == null) pkey = key;
                    if (kdef.name.startsWith("primary")) pkey = key;
                }
                else
                {
                    console.log("key "+kdef.name+" is defined twice");
                }
            });

            // Columns mapped to fields. Form definitions overrides
            let colfields:Map<string,FieldDefinition> = FieldDefinitions.getColumnIndex(block.clazz);
            let colffields:Map<string,FieldDefinition> = FieldDefinitions.getFormColumnIndex(this.name,block.alias);
            colffields.forEach((def,fld) => {colfields.set(fld,def)});

            let fields:string[] = [];
            let sorted:ColumnDefinition[] = [];

            // List of data-fields. First pkey
            if (pkey != null)
            {
                pkey.columns.forEach((part) =>
                {
                    let fname:string = part.name.toLowerCase();
                    let fdef:FieldDefinition = colfields.get(part.name);

                    if (fdef != null) fname = fdef.name;
                    sorted.push(colindex.get(part.name));

                    fields.push(fname);
                });
            }

            // Then other columns. First gather all definitions
            let columns:ColumnDefinition[] = ColumnDefinitions.get(block.clazz);
            let fieldidx:Map<string,FieldDefinition> = FieldDefinitions.getFieldIndex(block.clazz);
            let ffieldidx:Map<string,FieldDefinition> = FieldDefinitions.getFormFieldIndex(this.name,block.alias);
            ffieldidx.forEach((def,fld) => {fieldidx.set(fld,def)});

            columns.forEach((column) =>
            {
                let nonkey:boolean = true;
                if (pkey != null && pkey.partof(column.name)) nonkey = false;

                if (nonkey)
                {
                    sorted.push(column);
                    let fname:string = null;
                    let field:FieldDefinition = colfields.get(column.name);

                    if (field != null) fname = field.name;
                    else
                    {
                        field = fieldidx.get(column.name);
                        if (field == null) fname = column.name;
                        else
                        {
                            fname = field.name;
                            field.column = column.name;
                        }
                    }

                    fields.push(fname);
                }
            });

            columns = sorted;

            // Then other defined fields (block or form)
            fieldidx.forEach((field) => {if (!fields.includes(field.name,0)) fields.push(field.name)});

            // Set field properties and add undefined fields
            let bfieldlist:FieldInstance[] = bfields.get(block.alias);
            if (bfieldlist != null) bfieldlist.forEach((inst) =>
            {
                let fdef:FieldDefinition = fieldidx.get(inst.name);

                if (fdef == null)
                {
                    // Auto create field definition
                    fdef = {name: inst.name};
                    fieldidx.set(inst.name,fdef);
                    if (!fields.includes(inst.name,0)) fields.push(inst.name);
                }

                if (fdef.column == null)
                {
                    // Map to column, unless column is mapped otherwise
                    let cdef:ColumnDefinition = colindex.get(fdef.name);

                    if (cdef != null && colfields.get(fdef.name) == null)
                        fdef.column = fdef.name;
                }

                if (inst.id.length > 0)
                {
                    let id:string = inst.name+"."+inst.id;
                    let iddef:FieldDefinition = FieldDefinitions.getFormFieldOverride(this.name,block.alias,id);

                    if (iddef != null) fdef = iddef;
                    else iddef = FieldDefinitions.getFieldOverride(block.clazz,id);

                    if (iddef != null) fdef = iddef;
                }

                let cdef:ColumnDefinition = colindex.get(""+fdef.column);

                if (fdef.column != null && !fdef.hasOwnProperty("case"))
                    fdef.case = cdef.case;

                if (fdef.column != null && !fdef.hasOwnProperty("default"))
                    fdef.default = cdef.default;

                if (fdef.column != null && !fdef.hasOwnProperty("mandatory"))
                    fdef.mandatory = cdef.mandatory;

                if (fdef.type == null)
                    fdef.type = FieldImplementation.guess(cdef?.type);

                if (fdef.fieldoptions == null)
                        fdef.fieldoptions = {};

                if (!block.usage.update)
                    fdef.fieldoptions.update = false;

                inst.definition = fdef;
            });

            // Create data-backing table
            let table:Table = null;
            let rows:number = block.records.length;

            if (tabdef != null)
                table = new Table(this.conn,tabdef,pkey,columns,fieldidx,rows);

            block.fielddef = fieldidx;
            block.data = new FieldData(block,table,fields);

            // Start form
            block.ready = true;
        });

        // Get all fields on form
        this.fields$ = container.fields;

        if (this.blocks.length > 0)
            this.block$ = this.blocks[0];

        this.regroup();

        this.blocks.forEach((block) =>
        {
            if (block.records.length > 0)
                block.records[0].enable(true);
        });

        this.app.newForm(this);
        this.initiated$ = true;

        if (this.fields$.length > 0)
            this.fields$[0].focus();
    }


    public async showform(form:any, destroy:boolean, parameters?:Map<string,any>)
    {
        if (!this.validate())
            return;

        if (this.win == null)
        {
            await this.app.showform(form,destroy,parameters);
        }
        else
        {
            await this.replaceform(form,destroy,parameters);
        }
    }


    private async replaceform(form:any, destroy:boolean, parameters?:Map<string,any>)
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
        await this.app.preform(id.impl,parameters,inst,false);

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


    public async callform(form:any, destroy:boolean, parameters?:Map<string,any>)
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
        await this.app.preform(id.impl,parameters,inst,false);

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


    public async close(destroy?:boolean)
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
            console.log("Block alias "+blockdef.alias+" defined twice");
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
            console.log(this.name+" cannot create instance of "+blockdef.alias);
            return;
        }

        let alias:string = blockdef.alias;

        if (alias == null)
        {
            alias = block.constructor.name;
            alias = BlockDefinitions.getDefaultAlias(alias);
        }

        alias = alias.toLowerCase();

        impl.alias = alias;
        blockdef.alias = alias;
        this.blocks.push(impl);
        this.blkindex.set(alias,impl);

        impl.form = this;
        impl.setApplication(this.app);
    }


    private setBlockUsage(fusage:DatabaseUsage, blockdef:BlockDefinition) : void
    {
        let block:BlockImpl = this.blkindex.get(blockdef.alias);

        let usage:DatabaseUsage = {};
        let pusage:DatabaseUsage = blockdef.databaseopts;
        let dusage:DatabaseUsage = DatabaseDefinitions.getBlockDefault(block.clazz);

        if (dusage == null) dusage = {};
        if (pusage == null) pusage = {};
        if (fusage == null) fusage = {};

        usage = DBUsage.merge(pusage,dusage);
        usage = DBUsage.merge(fusage,usage);
        usage = DBUsage.override(fusage,usage);
        usage = DBUsage.complete(usage);

        block.usage = usage;
    }


    // Sort fields by group and set tabindex
    public regroup(groups?:string[]) : void
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

        let blocks:Map<string,FieldInstance[]> = new Map<string,FieldInstance[]>();

        this.fields$.forEach((field) =>
        {
            let fields:FieldInstance[] = blocks.get(field.block);

            if (fields == null)
            {
                fields = [];
                blocks.set(field.block,fields);
            }

            fields.push(field);
        });

        blocks.forEach((fields,bname) =>
        {this.blkindex.get(bname).fields = fields;});
    }


    public async validate() : Promise<boolean>
    {
        if (this.block == null) return(true);
        else return(await this.block.validate());
    }


    public onShow() : void
    {
    }


    public onHide() : void
    {
    }


    public sendkey(event:any,key:string) : void
    {
        this.block?.sendkey(event,key);
    }


    public addTrigger(instance:any, func:TriggerFunction, types?:Trigger|Trigger[]) : void
    {
        this.triggers.addTrigger(instance,func,types)
    }


    public addKeyTrigger(instance:any, func:TriggerFunction, keys?:string|string[]) : void
    {
        this.triggers.addTrigger(instance,func,Trigger.Key,null,keys)
    }


    public addFieldTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[], fields:string|string[], keys?:string|string[]) : void
    {
        this.triggers.addTrigger(instance,func,types,fields,keys)
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key:string)
    {
        if (this.app == null)
            return;

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


    public async invokeTriggers(type:Trigger, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        return(await this.triggers.invokeTriggers(type,event,key));
    }


    public async invokeFieldTriggers(type:Trigger, field:string, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        return(await this.triggers.invokeFieldTriggers(type,field,event,key));
    }


    public alert(msg:string, title:string, width?:string, height?:string) : void
    {
        MessageBox.show(this.app,msg,title,width,height);
    }
 }