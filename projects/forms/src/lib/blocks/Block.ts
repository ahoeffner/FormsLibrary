import { BlockImpl } from "./BlockImpl";
import { DatabaseUsage } from "../database/DatabaseUsage";

export class Block
{
    private impl:BlockImpl;


    constructor()
    {
        this.impl = new BlockImpl(this);
    }


    public get name() : string
    {
        return(this.impl.alias);
    }


    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.impl.setDatabaseUsage(usage);
    }
}