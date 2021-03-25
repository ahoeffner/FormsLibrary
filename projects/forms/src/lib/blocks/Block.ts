import { Form } from "../forms/Form";
import { BlockImpl } from "./BlockImpl";
import { Listener } from "../events/Listener";


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

    public addKeyListener(listener:Listener, keys?:string|string[]) : void
    {
        this._impl_.addKeyListener(this,listener,keys);
    }

    public addFieldListener(listener:Listener, types:string|string[], fields?:string|string[]) : void
    {
        this._impl_.addFieldListener(this,listener,types,fields);
    }
}