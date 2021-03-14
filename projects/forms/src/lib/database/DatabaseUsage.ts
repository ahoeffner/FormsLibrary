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

    public static override(overide:DatabaseUsage, base:DatabaseUsage) : DatabaseUsage
    {
        let merged:DatabaseUsage = base;
        if (overide == null) return(merged);
        
        if (overide.hasOwnProperty("query")  && !overide.query)  merged.query = false;
        if (overide.hasOwnProperty("insert") && !overide.insert) merged.insert = false;
        if (overide.hasOwnProperty("update") && !overide.update) merged.update = false;
        if (overide.hasOwnProperty("delete") && !overide.delete) merged.delete = false;

        return(merged);
    }

    public static complete(base:DatabaseUsage) : DatabaseUsage
    {
        if (base == null) base = {};
        if (!base.hasOwnProperty("query"))  base.query  = true;
        if (!base.hasOwnProperty("insert")) base.insert = true;
        if (!base.hasOwnProperty("update")) base.update = true;
        if (!base.hasOwnProperty("delete")) base.delete = true;
        return(base);
    }
}


export interface DatabaseUsage
{
    query?:boolean;
    insert?:boolean;
    update?:boolean;
    delete?:boolean;
}