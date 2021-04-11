import { Trigger } from "../events/Triggers";
import { TriggerFunction } from "../events/TriggerFunction";

export interface TriggerDefinition
{
    field:string;
    block:boolean;
    trigger:Trigger;
    params:string[];
    func:TriggerFunction;
}

export class TriggerDefinitions
{
    private static btriggers:Map<string,Map<string,TriggerDefinition>> = new Map<string,Map<string,TriggerDefinition>>();
    private static fbtriggers:Map<string,Map<string,Map<string,TriggerDefinition>>> = new Map<string,Map<string,Map<string,TriggerDefinition>>>();


    public static add(isblock:boolean, cname:string, def:TriggerDefinition) : void
    {
        let parts:string[] = TriggerDefinitions.split(def.field);

        if (isblock && parts.length != 1)
        {
            console.log("validate must specify field without '.' or ' '");
            return;
        }

        if (!isblock && parts.length != 2)
        {
            console.log("validate must specify alias.field without '.' or ' '");
            return;
        }


        let form:string = null;
        let block:string = null;
        let field:string = null;

        if (isblock)
        {
            block = cname;
            field = parts.shift();
        }
        else
        {
            form = cname;
            block = parts.shift();
            field = parts.shift();
        }

        def.field = field;

        if (isblock) TriggerDefinitions.addTrigger(block,field,def);
        else         TriggerDefinitions.addFormTrigger(form,block,field,def);
    }


    private static addTrigger(block:string,field:string,def:TriggerDefinition)
    {
        let triggers:Map<string,TriggerDefinition> = TriggerDefinitions.btriggers.get(block);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            TriggerDefinitions.btriggers.set(block,triggers);
        }

        triggers.set(field+"["+Trigger[def.trigger]+"]",def);
    }


    private static addFormTrigger(form:string,block:string,field:string,def:TriggerDefinition)
    {
        let ftriggers:Map<string,Map<string,TriggerDefinition>> = TriggerDefinitions.fbtriggers.get(form);

        if (ftriggers == null)
        {
            ftriggers = new Map<string,Map<string,TriggerDefinition>>();
            TriggerDefinitions.fbtriggers.set(form,ftriggers);
        }

        let triggers:Map<string,TriggerDefinition> = ftriggers.get(block);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            ftriggers.set(block,triggers);
        }

        triggers.set(field+"["+Trigger[def.trigger]+"]",def);
    }


    public static getTriggers(block:string) : Map<string,TriggerDefinition>
    {
        return(new Map(TriggerDefinitions.btriggers.get(block.toLowerCase())));
    }


    public static getFormTriggers(form:string,block:string) : Map<string,TriggerDefinition>
    {
        let triggers:Map<string,Map<string,TriggerDefinition>> = TriggerDefinitions.fbtriggers.get(form.toLowerCase());
        if (triggers != null) return(new Map(triggers.get(block.toLowerCase())));
        return(new Map());
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.trim().split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}
