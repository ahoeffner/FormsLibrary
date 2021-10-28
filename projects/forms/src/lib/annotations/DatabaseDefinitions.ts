import { DatabaseUsage, DBUsage } from "../database/DatabaseUsage";

export interface PropUsage
{
    prop?:string;
    usage?:DatabaseUsage;
}


export class DatabaseDefinitions
{
    private static bdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();
    private static fdefault:Map<string,DatabaseUsage> = new Map<string,DatabaseUsage>();

    public static setFormUsage(form:string, usage:DatabaseUsage) : void
    {
        DatabaseDefinitions.fdefault.set(form,usage);
    }

    public static getFormUsage(form:string) : DatabaseUsage
    {
        let usage:DatabaseUsage = DatabaseDefinitions.fdefault.get(form.toLowerCase());
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
            query:  true,
            insert: true,
            update: true,
            delete: true
        };

        if (block != null) usage = DatabaseDefinitions.bdefault.get(block.toLowerCase());
        return(DBUsage.merge(usage,base));
    }
}