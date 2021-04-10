export interface LOVDefinition
{
    inst:any;
    func:string;
    params:string[];
}

export class LOVDefinitions
{
    private static defs:Map<string,LOVDefinition> = new Map<string,LOVDefinition>();
    private static iddefs:Map<string,LOVDefinition> = new Map<string,LOVDefinition>();

    public static add(block:boolean, field:string, inst:any, func:string, params:string[])
    {
        let register:Map<string,LOVDefinition> = null;
        let parts:string[] = LOVDefinitions.split(field);

        if (block)
        {
            if (parts.length == 0 || parts.length > 2)
            {
                console.log("@listofvalues on block must specify field[.id], not '"+field+"'");
                return;
            }

            let fname:string = parts[0];

            if (parts.length > 1)
            {
                fname = fname+"."+parts[1];
                register = LOVDefinitions.iddefs;
            }

            let def:LOVDefinition = register.get(fname);
            if (def != null) console.log("@listofvalues defined twice for "+fname+", ignored");

            def = {inst: inst, func: func, params: params};
            register.set(fname,def);
        }
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}