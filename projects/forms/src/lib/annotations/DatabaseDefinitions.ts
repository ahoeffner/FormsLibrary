import { DatabaseUsage } from "../database/DatabaseUsage";

export interface DBUsage
{
    type?:string;
    prop?:string;
    usage?:DatabaseUsage;
}


export class DatabaseDefinitions
{
    private static usage:Map<string,DBUsage[]> = new Map<string,DBUsage[]>();

    public static setUsage(comp:string, type:string, prop:string, usage:DatabaseUsage) : void
    {
        let opts:DBUsage[] = DatabaseDefinitions.usage.get(comp);

        if (opts == null)
        {
            opts = [];
            DatabaseDefinitions.usage.set(comp,opts);
        }

        let dbopts:DBUsage = {type: type, prop: prop, usage: usage};
        opts.unshift(dbopts);
    }


    public static getUsage(comp:string) : DBUsage[]
    {
        let usage:DBUsage[] = DatabaseDefinitions.usage.get(comp);
        if (usage == null) usage = [{}];
        return(usage);
    }
}