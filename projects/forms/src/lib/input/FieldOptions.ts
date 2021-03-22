export interface FieldOptions
{
    query?:boolean;
    insert?:boolean;
    update?:boolean;
}


export class FieldOption
{
    public static restrict(opt:FieldOptions, restrict:FieldOptions) : FieldOptions
    {
        if (restrict == null) return(opt);
        if (restrict.hasOwnProperty("query")) opt.query = restrict.query;
        if (restrict.hasOwnProperty("insert")) opt.query = restrict.insert;
        if (restrict.hasOwnProperty("update")) opt.query = restrict.update;

        return(opt);
    }
}