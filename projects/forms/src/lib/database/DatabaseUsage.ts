import { Utils } from "../utils/Utils";

export class DBUsage
{
    public static merge(changes:DatabaseUsage, base:DatabaseUsage) : DatabaseUsage
    {
        let utils:Utils = new Utils();
        if (changes == null) return(base);
        let merged:DatabaseUsage = utils.clone(base);
        if (changes.hasOwnProperty("query"))  merged.query  = changes.query;
        if (changes.hasOwnProperty("insert")) merged.insert = changes.insert;
        if (changes.hasOwnProperty("update")) merged.update = changes.update;
        if (changes.hasOwnProperty("delete")) merged.delete = changes.delete;
        return(merged);
    }

    public static override(overide:DatabaseUsage, base:DatabaseUsage) : DatabaseUsage
    {
        let utils:Utils = new Utils();
        if (overide == null) return(base);
        let merged:DatabaseUsage = utils.clone(base);

        if (overide.hasOwnProperty("query")  && !overide.query)  merged.query = false;
        if (overide.hasOwnProperty("insert") && !overide.insert) merged.insert = false;
        if (overide.hasOwnProperty("update") && !overide.update) merged.update = false;
        if (overide.hasOwnProperty("delete") && !overide.delete) merged.delete = false;

        return(merged);
    }

    public static complete(base:DatabaseUsage) : DatabaseUsage
    {
        let utils:Utils = new Utils();
        
        if (base == null) base = {};
        else base = utils.clone(base);

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