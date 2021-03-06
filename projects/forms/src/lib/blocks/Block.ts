import { DatabaseUsage } from "../database/DatabaseUsage";
import { BlockImpl } from "./BlockImpl";

export class Block
{
    private impl:BlockImpl;


    constructor()
    {
        this.impl = new BlockImpl(this);
    }


    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.impl.setDatabaseUsage(usage);
    }
}