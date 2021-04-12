export interface JOINDefinition
{
    master: {alias:string, key:string},
    detail: {alias:string, key:string},
}


export class JOINDefinitions
{
    private static defs:Map<string,JOINDefinition[]> = new Map<string,JOINDefinition[]>();

    public static add(form:string, def:JOINDefinition) : void
    {
        let joins:JOINDefinition[] = JOINDefinitions.defs.get(form);

        if (joins == null)
        {
            joins = [];
            JOINDefinitions.defs.set(form,joins);
        }

        joins.unshift(def);
    }


    public static get(form:string) : JOINDefinition[]
    {
        return(JOINDefinitions.defs.get(form.toLowerCase()));
    }
}