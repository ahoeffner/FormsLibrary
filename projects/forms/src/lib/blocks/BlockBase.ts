import { Config } from "../application/Config";
import { Listener } from "../events/Listener";
import { BlockBaseImpl } from "./BlockBaseImpl";

export class BlockBase
{
    private base:BlockBaseImpl;

    constructor()
    {
        this.base = new BlockBaseImpl(this);
    }

    public set name(alias:string)
    {
        this.base.name = alias;
    }

    public get name() : string
    {
        return(this.base.name);
    }

    public addListener(listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        this.base.addListener(this,listener,types,keys);
    }
}