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

    public static add(field:string,comp:any,func:string,params:string[])
    {
        let parts:string[] = LOVDefinitions.split(field);
        LOVDefinitions.defs.set(field,{inst: comp, func: func, params: params});
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}