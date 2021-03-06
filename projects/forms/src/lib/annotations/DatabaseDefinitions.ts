import { DatabaseUsage } from "../database/DatabaseUsage";

export interface DBUsage
{
    prop?:string;
    usage?:DatabaseUsage;
}


export class DatabaseDefinitions
{
    private static usage:Map<string,DBUsage[]> = new Map<string,DBUsage[]>();
    private static bdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();
    private static fdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();

    public static setFormDefault(form:string, usage:DatabaseUsage) : void
    {
        DatabaseDefinitions.fdefault.set(form,usage);
    }

    public static getFormDefault(form:string) : DatabaseUsage
    {
        let usage:DatabaseUsage = DatabaseDefinitions.fdefault.get(form.toLowerCase());
        if (usage == null) usage = {query: true, insert: true, update: true, delete: true};
        return(usage);
    }

    public static setBlockDefault(block:string, usage:DatabaseUsage) : void
    {
        DatabaseDefinitions.bdefault.set(block,usage);
    }

    public static getBlockDefault(block:string) : DatabaseUsage
    {
        let usage:DatabaseUsage = null;
        if (block != null) usage = DatabaseDefinitions.bdefault.get(block.toLowerCase());
        if (usage == null) usage = {query: true, insert: true, update: true, delete: true};
        return(usage);
    }

    public static setBlockUsage(form:string, prop:string, usage:DatabaseUsage) : void
    {
        let opts:DBUsage[] = DatabaseDefinitions.usage.get(form);

        if (opts == null)
        {
            opts = [];
            DatabaseDefinitions.usage.set(form,opts);
        }

        let dbopts:DBUsage = {prop: prop, usage: usage};
        opts.unshift(dbopts);
    }


    public static getBlockUsage(form:string) : DBUsage[]
    {
        let usage:DBUsage[] = DatabaseDefinitions.usage.get(form.toLowerCase());
        if (usage == null) usage = [];
        return(usage);
    }
}