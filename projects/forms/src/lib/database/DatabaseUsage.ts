export class DBUsage
{
    public static merge(changes:DatabaseUsage, base:DatabaseUsage) : DatabaseUsage
    {
        let merged:DatabaseUsage = base;
        if (changes == null) return(merged);
        if (changes.hasOwnProperty("query"))  merged.query  = changes.query;
        if (changes.hasOwnProperty("insert")) merged.insert = changes.insert;
        if (changes.hasOwnProperty("update")) merged.update = changes.update;
        if (changes.hasOwnProperty("delete")) merged.delete = changes.delete;
        return(merged);
    }
}


export interface DatabaseUsage
{
    query?:boolean;
    insert?:boolean;
    update?:boolean;
    delete?:boolean;
}