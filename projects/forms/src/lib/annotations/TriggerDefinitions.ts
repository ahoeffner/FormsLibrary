import { Trigger } from "../events/Triggers";
import { TriggerFunction } from "../events/TriggerFunction";

export interface TriggerDefinition
{
    inst:any;
    field:string;
    trigger:Trigger;
    params:string[];
    func:TriggerFunction;
}

export class TriggerDefinitions
{
    private static triggers:Map<string,Trigger[]> = new Map<string,Trigger[]>();

    public static add(block:boolean, cname:string, def:TriggerDefinition) : void
    {
        let parts:string[] = TriggerDefinitions.split(def.field);

        if (block && parts.length != 1)
        {
            console.log("validate must specify field without '.' or ' '");
            return;
        }

        if (!block && parts.length != 2)
        {
            console.log("validate must specify alias.field without '.' or ' '");
            return;
        }

        if (!block) cname = parts.shift();
        let fname:string = parts.shift();

        //console.log("add validate on block: "+cname+" field: "+fname);
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.trim().split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}
