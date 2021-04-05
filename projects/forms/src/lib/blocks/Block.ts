import { Form } from "../forms/Form";
import { BlockImpl } from "./BlockImpl";
import { Trigger } from "../events/Triggers";
import { Statement } from "../database/Statement";
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

    public getValue(record:number, field:string) : any
    {
        return(this._impl_.getValue(record,field));
    }

    public setValue(record:number, field:string, value:any) : boolean
    {
        return(this._impl_.setValue(record,field,value));
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

    public get row() : number
    {
        return(this.row);
    }

    public get record() : number
    {
        return(this.record);
    }

    public insert(below?:boolean) : number
    {
        if (below == null) below = true;
        this._impl_.insert(!below);
        return(this._impl_.record);
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

    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        return(this._impl_.execute(stmt,firstrow,firstcolumn));
    }

    public set usage(usage:DatabaseUsage)
    {
        this._impl_.setUsage(usage);
    }

    public addTrigger(listener:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        this._impl_.addTrigger(this,listener,types);
    }

    public addKeyTrigger(listener:TriggerFunction, keys:string|string[]) : void
    {
        this._impl_.addKeyTrigger(this,listener,keys);
    }

    public addFieldTrigger(listener:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        this._impl_.addFieldTrigger(this,listener,types,fields);
    }
}