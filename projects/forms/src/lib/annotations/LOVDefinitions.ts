export interface LOVDefinition
{
    inst:any;
    func:string;
    params:string[];
}

export class LOVDefinitions
{
    private static bdefs:Map<string,Map<string,LOVDefinition>> = new Map<string,Map<string,LOVDefinition>>();
    private static biddefs:Map<string,Map<string,LOVDefinition>> = new Map<string,Map<string,LOVDefinition>>();

    public static add(isblock:boolean, cname:string, fieldspec:string, inst:any, func:string, params:string[])
    {
        let form:string = null;
        let block:string = null;
        let field:string = null;

        let register:Map<string,LOVDefinition> = null;
        let parts:string[] = LOVDefinitions.split(fieldspec);

        if (isblock)
        {
            block = cname;
        }
        else
        {
            form = cname;
            block = parts.shift();
        }

        if (parts.length == 0 || parts.length > 2)
        {
            console.log("@listofvalues must specify [alias.]field[.id], not '"+fieldspec+"'");
            return;
        }

        field = parts.shift();
        if (parts.length > 0) field += "."+parts.shift();

        console.log("form: "+form+" block: "+block+" field: "+field);

/*
        if (parts.length == 0)
        {
            register = LOVDefinitions.bdefs.get(cname);

            if (register == null)
            {
                register = new Map<string,LOVDefinition>();
                LOVDefinitions.bdefs.set(cname,register);
            }
        }
        else
        {
            fname = fname+"."+parts.shift();
            register = LOVDefinitions.biddefs.get(cname);

            if (register == null)
            {
                register = new Map<string,LOVDefinition>();
                LOVDefinitions.biddefs.set(cname,register);
            }
        }

        let def:LOVDefinition = register.get(fname);
        if (def != null) console.log("@listofvalues defined twice for "+fname+", ignored");

        console.log("listofvalues form: "+form+" block: "+cname+" field: "+fieldspec);
        def = {inst: inst, func: func, params: params};
        register.set(fname,def);
*/
    }


    public static get(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.bdefs.get(block.toLowerCase()));
    }


    public static getid(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.biddefs.get(block.toLowerCase()));
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.trim().split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}