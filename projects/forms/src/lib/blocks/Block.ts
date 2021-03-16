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

    public addListener(listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        this._impl_.addListener(this,listener,types,keys);
    }
}