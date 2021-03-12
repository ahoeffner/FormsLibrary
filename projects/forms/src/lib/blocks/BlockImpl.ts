import { Block } from "./Block";
import { DatabaseUsage } from "../database/DatabaseUsage";


export class BlockImpl
{
    private dbusage:DatabaseUsage;

    constructor(private block:Block)
    {
        this.dbusage = {query: true, insert: true, update: true, delete: true};
    }

    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.dbusage = usage;
    }
}