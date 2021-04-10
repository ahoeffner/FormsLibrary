export interface LOVDefinition
{
    inst:any;
    func:string;
    params:string[];
}

export class LOVDefinitions
{
    private static defs:Map<string,Map<string,LOVDefinition>> = new Map<string,Map<string,LOVDefinition>>();
    private static iddefs:Map<string,Map<string,LOVDefinition>> = new Map<string,Map<string,LOVDefinition>>();

    public static add(block:boolean, cname:string, field:string, inst:any, func:string, params:string[])
    {
        let register:Map<string,LOVDefinition> = null;
        let parts:string[] = LOVDefinitions.split(field);

        if (!block) cname = parts.shift();

        if (parts.length == 0 || parts.length > 1)
        {
            console.log("@listofvalues must specify [alias.]field[.id], not '"+field+"'");
            return;
        }

        let fname:string = parts.shift();

        if (parts.length == 0)
        {
            register = LOVDefinitions.defs.get(cname);

            if (register == null)
            {
                register = new Map<string,LOVDefinition>();
                LOVDefinitions.defs.set(cname,register);
            }
        }
        else
        {
            fname = fname+"."+parts.shift();
            register = LOVDefinitions.iddefs.get(cname);

            if (register == null)
            {
                register = new Map<string,LOVDefinition>();
                LOVDefinitions.iddefs.set(cname,register);
            }
        }

        let def:LOVDefinition = register.get(fname);
        if (def != null) console.log("@listofvalues defined twice for "+fname+", ignored");

        def = {inst: inst, func: func, params: params};
        register.set(fname,def);
    }


    public static get(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.defs.get(block.toLowerCase()));
    }


    public static getid(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.iddefs.get(block.toLowerCase()));
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}