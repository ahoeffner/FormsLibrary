import { Form } from "../forms/Form";
import { BlockImpl } from "./BlockImpl";
import { Trigger } from "../events/Triggers";
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

    public addKeyListener(listener:TriggerFunction, keys?:string|string[]) : void
    {
        this._impl_.addKeyTrigger(this,listener,keys);
    }

    public addFieldListener(listener:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        this._impl_.addFieldTrigger(this,listener,types,fields);
    }
}