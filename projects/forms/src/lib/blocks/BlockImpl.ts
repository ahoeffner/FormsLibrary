import { Block } from "./Block";
import { DatabaseUsage } from "../database/DatabaseUsage";


export class BlockImpl
{
    private alias$:string;
    private dbusage:DatabaseUsage;


    constructor(private block:Block)
    {
        this.dbusage = {query: true, insert: true, update: true, delete: true};
    }


    public set alias(alias:string)
    {
        this.alias$ = alias;
    }


    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.dbusage = usage;
    }
}