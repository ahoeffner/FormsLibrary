import { Listener } from "../events/Listener";
import { BlockBaseImpl } from "./BlockBaseImpl";

export class BlockBase
{
    private name$:string;
    private base:BlockBaseImpl;

    constructor()
    {
        this.base = new BlockBaseImpl(this);
    }

    public set name(alias:string)
    {
        this.name$ = alias;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public addListener(listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        this.base.addListener(listener,types,keys);
    }
}