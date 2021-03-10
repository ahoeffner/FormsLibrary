import { BlockImpl } from "./BlockImpl";
import { BlockBase } from "./BlockBase";
import { DatabaseUsage } from "../database/DatabaseUsage";

export class Block extends BlockBase
{
    private impl:BlockImpl;
    // dont rename impl as it is read behind the scenes

    constructor()
    {
        super();
        this.impl = new BlockImpl(this);
    }

    public get name() : string
    {
        return(this.impl.name);
    }

    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.impl.setDatabaseUsage(usage);
    }
}