import { Form } from "../forms/Form";
import { BlockImpl } from "./BlockImpl";
import { keymap } from "../keymap/KeyMap";
import { Trigger } from "../events/Triggers";
import { Statement } from "../database/Statement";
import { FieldDefinition } from "../input/FieldDefinition";
import { TriggerFunction } from "../events/TriggerFunction";
import { TableDefinition } from "../database/TableDefinition";
import { ListOfValuesFunction } from "../listval/ListOfValuesFunction";


export class Block
{
    private _impl_:BlockImpl;
    // dont rename impl as it is read behind the scenes

    constructor()
    {
        this._impl_ = new BlockImpl(this);
    }

    public get form(): Form
    {
        return(this._impl_.form.form);
    }

    public get table() : TableDefinition
    {
        return(this._impl_.table);
    }

    public getValue(record:number, field:string) : any
    {
        return(this._impl_.getValue(record,field));
    }

    public getQueryValue(field:string) : any
    {
        return(this._impl_.getFieldValue(0,field));
    }

    public async setValue(record:number, field:string, value:any) : Promise<boolean>
    {
        return(await this._impl_.setValue(record,field,value));
    }

    public get querymode() : boolean
    {
        return(this._impl_.querymode);
    }

    public cancel() : void
    {
        this._impl_.sendkey(null,keymap.escape);
    }

    public get ready() : boolean
    {
        return(this._impl_.ready)
    }

    public async enterquery(override?:boolean) : Promise<boolean>
    {
        return(this._impl_.keyentqry(override));
    }

    public async executequery(override?:boolean) :  Promise<boolean>
    {
        return(this._impl_.keyexeqry(override));
    }

    public nextrecord() : void
    {
        this._impl_.sendkey(null,keymap.nextrecord);
    }

    public prevrecord() : void
    {
        this._impl_.sendkey(null,keymap.prevrecord);
    }

    public nextblock() : void
    {
        this._impl_.sendkey(null,keymap.nextblock);
    }

    public prevblock() : void
    {
        this._impl_.sendkey(null,keymap.prevblock);
    }

    public pageup() : void
    {
        this._impl_.sendkey(null,keymap.pageup);
    }

    public pagedown() : void
    {
        this._impl_.sendkey(null,keymap.pagedown);
    }

    public get row() : number
    {
        return(this._impl_.row);
    }

    public get record() : number
    {
        return(this._impl_.record);
    }

    public get filtered() : boolean
    {
        return(this._impl_.searchfilter.length > 0);
    }

    public async createControlRecord() : Promise<number>
    {
        return(this._impl_.createControlRecord());
    }

    public async delete(override?:boolean) : Promise<boolean>
    {
        if (override) return(this._impl_.delete());
        else return(this._impl_.sendkey(null,keymap.delete));
    }

    public setFieldDefinition(def:FieldDefinition) : boolean
    {
        return(this._impl_.setFieldDefinition(def));
    }

    public setPossibleValues(field:string, values:Set<any>|Map<string,any>, enforce?:boolean) : boolean
    {
        return(this._impl_.setPossibleValues(field,values,enforce));
    }

    public showListOfValues(field:string, id?:string, row?:number) : void
    {
        this._impl_.showListOfValues(field,id,row);
    }

    public async insert(above?:boolean, override?:boolean) : Promise<boolean>
    {
        if (above == null) above = false;
        if (override) return(this._impl_.insert(!above));
        else
        {
            if (!above) return(this._impl_.sendkey(null,keymap.insertafter));
            else        return(this._impl_.sendkey(null,keymap.insertbefore));
        }
    }

    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        return(this._impl_.execute(stmt,firstrow,firstcolumn));
    }


    public addListOfValues(func:ListOfValuesFunction, field:string, id?:string) :  void
    {
        this._impl_.addListOfValues(false,func,field,id);
    }


    public addTrigger(listener:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        this._impl_.addTrigger(this,listener,types);
    }

    public addKeyTrigger(listener:TriggerFunction, keys:keymap|keymap[]) : void
    {
        this._impl_.addKeyTrigger(this,listener,keys);
    }

    public addFieldTrigger(listener:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        this._impl_.addFieldTrigger(this,listener,types,fields);
    }

    public alert(message:string, title?:string, width?:string, height?:string) : void
    {
        this._impl_.alert(message,title,width,height);
    }
}