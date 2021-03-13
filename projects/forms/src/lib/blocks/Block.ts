import { BlockImpl } from "./BlockImpl";
import { BlockBase } from "./BlockBase";
import { Config } from "../application/Config";
import { DatabaseUsage } from "../database/DatabaseUsage";

export class Block extends BlockBase
{
    private impl:BlockImpl;
    // dont rename impl as it is read behind the scenes

    constructor(conf:Config)
    {
        super(conf);
        this.impl = new BlockImpl(this);
    }

    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.impl.setDatabaseUsage(usage);
    }
}