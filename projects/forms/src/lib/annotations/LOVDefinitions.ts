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

    public static add(field:string,comp:any, func:string,params:string[])
    {
        LOVDefinitions.defs.set(field,{inst: comp, func: func, params: params});
    }
}