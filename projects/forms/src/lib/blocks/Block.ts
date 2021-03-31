import { Form } from "../forms/Form";
import { BlockImpl } from "./BlockImpl";
import { Trigger } from "../events/Triggers";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { TriggerFunction } from "../events/TriggerFunction";


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

    public getValue(field:string, row:number) : any
    {
        return(this._impl_.getValue(field,row));
    }

    public setValue(field:string, row:number, value:any) : boolean
    {
        return(this._impl_.setValue(field,row,value));
    }

    public get queryMode() : boolean
    {
        return(this._impl_.querymode);
    }

    public cancel() : void
    {
        this._impl_.dokey("escape");
    }

    public enterQuery() : void
    {
        this._impl_.dokey("enterquery");
    }

    public executeQuery() : void
    {
        this._impl_.dokey("executequery");
    }

    public nextRecord() : void
    {
        this._impl_.dokey("nextrecord");
    }

    public prevRecord() : void
    {
        this._impl_.dokey("prevrecord");
    }

    public pageUp() : void
    {
        this._impl_.dokey("pageup");
    }

    public pageDown() : void
    {
        this._impl_.dokey("pagedown");
    }

    public deleteRecord() : void
    {
        this._impl_.dokey("delete");
    }

    public createRecord(above?:boolean)
    {
        if (above == null) above = false;
        if (!above) this._impl_.dokey("insertafter");
        else        this._impl_.dokey("insertbefore");
    }

    public set restrict(usage:DatabaseUsage)
    {
        this._impl_.setDatabaseUsage(usage);
    }

    public addKeyListener(listener:TriggerFunction, keys?:string|string[]) : void
    {
        this._impl_.addKeyTrigger(this,listener,keys);
    }

    public addFieldListener(listener:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        this._impl_.addFieldTrigger(this,listener,types,fields);
    }
}