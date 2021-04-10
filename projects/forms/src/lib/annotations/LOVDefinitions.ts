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
    private static fdefs:Map<string,Map<string,Map<string,LOVDefinition>>> = new Map<string,Map<string,Map<string,LOVDefinition>>>();
    private static fiddefs:Map<string,Map<string,Map<string,LOVDefinition>>> = new Map<string,Map<string,Map<string,LOVDefinition>>>();

    public static add(isblock:boolean, cname:string, fieldspec:string, inst:any, func:string, params:string[])
    {
        let form:string = null;
        let block:string = null;
        let field:string = null;

        let id:boolean = false;
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

        if (parts.length > 0)
        {
            id = true;
            field += "."+parts.shift();
        }

        let def:LOVDefinition =
        {
            inst: inst,
            func: func,
            params: params
        }

        if (form != null)
        {
            if (!id) LOVDefinitions.addFormLov(form,block,field,def);
            else     LOVDefinitions.addFormIdLov(form,block,field,def);
        }
        else
        {
            if (!id) LOVDefinitions.addBlockLov(block,field,def);
            else     LOVDefinitions.addBlockIdLov(block,field,def);
        }
    }


    private static addFormLov(form:string, block:string, field:string, def:LOVDefinition)
    {
        let fdefs:Map<string,Map<string,LOVDefinition>> = LOVDefinitions.fdefs.get(form);

        if (fdefs == null)
        {
            fdefs = new Map<string,Map<string,LOVDefinition>>();
            LOVDefinitions.fdefs.set(form,fdefs);
        }

        let bdefs:Map<string,LOVDefinition> = fdefs.get(block);

        if (bdefs == null)
        {
            bdefs = new Map<string,LOVDefinition>();
            fdefs.set(block,bdefs);
        }

        bdefs.set(field,def);
    }


    private static addFormIdLov(form:string, block:string, field:string, def:LOVDefinition)
    {
        let fdefs:Map<string,Map<string,LOVDefinition>> = LOVDefinitions.fiddefs.get(form);

        if (fdefs == null)
        {
            fdefs = new Map<string,Map<string,LOVDefinition>>();
            LOVDefinitions.fiddefs.set(form,fdefs);
        }

        let bdefs:Map<string,LOVDefinition> = fdefs.get(block);

        if (bdefs == null)
        {
            bdefs = new Map<string,LOVDefinition>();
            fdefs.set(block,bdefs);
        }

        bdefs.set(field,def);
    }


    private static addBlockLov(block:string, field:string, def:LOVDefinition)
    {
        let bdefs:Map<string,LOVDefinition> = LOVDefinitions.bdefs.get(block);

        if (bdefs == null)
        {
            bdefs = new Map<string,LOVDefinition>();
            LOVDefinitions.bdefs.set(block,bdefs);
        }

        bdefs.set(field,def);
    }


    private static addBlockIdLov(block:string, field:string, def:LOVDefinition)
    {
        let bdefs:Map<string,LOVDefinition> = LOVDefinitions.biddefs.get(block);

        if (bdefs == null)
        {
            bdefs = new Map<string,LOVDefinition>();
            LOVDefinitions.biddefs.set(block,bdefs);
        }

        bdefs.set(field,def);
    }


    public static getblock(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.bdefs.get(block.toLowerCase()));
    }


    public static getblockid(block:string) : Map<string,LOVDefinition>
    {
        return(LOVDefinitions.biddefs.get(block.toLowerCase()));
    }



    public static getform(form:string, block:string) : Map<string,LOVDefinition>
    {
        let fdefs:Map<string,Map<string,LOVDefinition>> = LOVDefinitions.fdefs.get(form.toLowerCase());
        if (fdefs != null) return(fdefs.get(block.toLowerCase()));
        return(null);
    }


    public static getidform(form:string, block:string) : Map<string,LOVDefinition>
    {
        let fdefs:Map<string,Map<string,LOVDefinition>> = LOVDefinitions.fiddefs.get(form.toLowerCase());
        if (fdefs != null) return(fdefs.get(block.toLowerCase()));
        return(null);
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.trim().split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}