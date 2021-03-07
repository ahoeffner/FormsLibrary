import { DatabaseUsage, DBUsage } from "../database/DatabaseUsage";

export interface PropUsage
{
    prop?:string;
    usage?:DatabaseUsage;
}


export class DatabaseDefinitions
{
    private static usage:Map<string,PropUsage[]> = new Map<string,PropUsage[]>();
    private static bdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();
    private static fdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();

    public static setFormUsage(form:string, usage:DatabaseUsage) : void
    {
        DatabaseDefinitions.fdefault.set(form,usage);
    }

    public static getFormUsage(form:string) : DatabaseUsage
    {
        let usage:DatabaseUsage = DatabaseDefinitions.fdefault.get(form.toLowerCase());
        if (usage == null) usage = {query: false, insert: false, update: false, delete: false};
        return(usage);
    }

    public static setBlockDefault(block:string, usage:DatabaseUsage) : void
    {
        DatabaseDefinitions.bdefault.set(block,usage);
    }

    public static getBlockDefault(block:string) : DatabaseUsage
    {
        let usage:DatabaseUsage = null;

        let base:DatabaseUsage =
        {
            query:  false,
            insert: false,
            update: false,
            delete: false
        };

        if (block != null) usage = DatabaseDefinitions.bdefault.get(block.toLowerCase());
        return(DBUsage.merge(usage,base));
    }

    public static setBlockUsage(form:string, prop:string, usage:DatabaseUsage) : void
    {
        let opts:PropUsage[] = DatabaseDefinitions.usage.get(form);

        if (opts == null)
        {
            opts = [];
            DatabaseDefinitions.usage.set(form,opts);
        }

        let dbopts:PropUsage = {prop: prop, usage: usage};
        opts.unshift(dbopts);
    }


    public static getBlockUsage(form:string) : PropUsage[]
    {
        let usage:PropUsage[] = DatabaseDefinitions.usage.get(form.toLowerCase());
        if (usage == null) usage = [];
        return(usage);
    }
}