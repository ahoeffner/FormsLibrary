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

    public get querymode() : boolean
    {
        return(this._impl_.querymode);
    }

    public cancel() : void
    {
        this._impl_.dokey("escape");
    }

    public enterquery(override?:boolean) : void
    {
        if (override) this._impl_.enterqry();
        else this._impl_.dokey("enterquery");
    }

    public executequery(override?:boolean) : void
    {
        if (override) this._impl_.executeqry();
        else this._impl_.dokey("executequery");
    }

    public nextrecord() : void
    {
        this._impl_.dokey("nextrecord");
    }

    public prevrecord() : void
    {
        this._impl_.dokey("prevrecord");
    }

    public pageup() : void
    {
        this._impl_.dokey("pageup");
    }

    public pagedown() : void
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

    public async createControlRecord() : Promise<number>
    {
        return(await this._impl_.createControlRecord());
    }

    public delete(override?:boolean) : void
    {
        if (override) this._impl_.delete();
        else this._impl_.dokey("delete");
    }

    public insert(above?:boolean, override?:boolean)
    {
        if (above == null) above = false;
        if (override) this._impl_.insert(!above);
        else
        {
            if (!above) this._impl_.dokey("insertafter");
            else        this._impl_.dokey("insertbefore");
        }
    }

    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        return(this._impl_.execute(stmt,firstrow,firstcolumn));
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

    public alert(message:string, title?:string, width?:string, height?:string) : void
    {
        this._impl_.alert(message,title,width,height);
    }
}