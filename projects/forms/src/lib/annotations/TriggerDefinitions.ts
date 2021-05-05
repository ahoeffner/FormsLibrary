import { keymap } from "../keymap/KeyMap";
import { Trigger } from "../events/Triggers";
import { TriggerFunction } from "../events/TriggerFunction";


export interface TriggerDefinition
{
    key?:keymap,
    field?:string;
    block:string;
    blktrg:boolean;
    trigger:Trigger;
    params:string[];
    func:TriggerFunction;
}


export class TriggerDefinitions
{
    private static bftriggers:Map<string,Map<string,TriggerDefinition>> = new Map<string,Map<string,TriggerDefinition>>();
    private static bktriggers:Map<string,Map<string,TriggerDefinition>> = new Map<string,Map<string,TriggerDefinition>>();
    private static fktriggers:Map<string,Map<string,TriggerDefinition>> = new Map<string,Map<string,TriggerDefinition>>();
    private static fftriggers:Map<string,Map<string,Map<string,TriggerDefinition>>> = new Map<string,Map<string,Map<string,TriggerDefinition>>>();


    public static add(isblock:boolean, cname:string, def:TriggerDefinition) : void
    {
        if (def.key == null) this.addft(isblock,cname,def);
        else                 this.addkt(isblock,cname,def);
    }


    private static addkt(isblock:boolean, cname:string, def:TriggerDefinition) : void
    {
        if (isblock) TriggerDefinitions.addKeyTrigger(cname,def);
        else         TriggerDefinitions.addFormKeyTrigger(cname,def);
    }


    private static addft(isblock:boolean, cname:string, def:TriggerDefinition) : void
    {
        let parts:string[] = TriggerDefinitions.split(def.field);

        if (isblock && parts.length > 1)
        {
            console.log("validate must specify field without '.' or ' '");
            return;
        }

        if (!isblock && (parts.length < 1 || parts.length > 2))
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
            if (parts.length > 0) field = parts.shift();
        }
        else
        {
            form = cname;
            block = parts.shift();
            def.block = block;
            if (parts.length > 0) field = parts.shift();
        }

        def.field = field;

        if (isblock) TriggerDefinitions.addFieldTrigger(block,field,def);
        else         TriggerDefinitions.addFormFieldTrigger(form,block,field,def);
    }


    private static addFieldTrigger(block:string,field:string,def:TriggerDefinition)
    {
        let triggers:Map<string,TriggerDefinition> = TriggerDefinitions.bftriggers.get(block);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            TriggerDefinitions.bftriggers.set(block,triggers);
        }

        triggers.set(field+"["+Trigger[def.trigger]+"]",def);
    }


    private static addKeyTrigger(block:string,def:TriggerDefinition)
    {
        let triggers:Map<string,TriggerDefinition> = TriggerDefinitions.bktriggers.get(block);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            TriggerDefinitions.bktriggers.set(block,triggers);
        }

        triggers.set(keymap[def.key]+"["+Trigger[def.trigger]+"]",def);
    }


    private static addFormFieldTrigger(form:string,block:string,field:string,def:TriggerDefinition)
    {
        let ftriggers:Map<string,Map<string,TriggerDefinition>> = TriggerDefinitions.fftriggers.get(form);

        if (ftriggers == null)
        {
            ftriggers = new Map<string,Map<string,TriggerDefinition>>();
            TriggerDefinitions.fftriggers.set(form,ftriggers);
        }

        let triggers:Map<string,TriggerDefinition> = ftriggers.get(block);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            ftriggers.set(block,triggers);
        }

        triggers.set(field+"["+Trigger[def.trigger]+"]",def);
    }


    private static addFormKeyTrigger(form:string,def:TriggerDefinition)
    {
        let triggers:Map<string,TriggerDefinition> = TriggerDefinitions.fktriggers.get(form);

        if (triggers == null)
        {
            triggers = new Map<string,TriggerDefinition>();
            TriggerDefinitions.fktriggers.set(form,triggers);
        }

        triggers.set(keymap[def.key]+"["+Trigger[def.trigger]+"]",def);
    }


    public static getFieldTriggers(block:string) : Map<string,TriggerDefinition>
    {
        return(new Map(TriggerDefinitions.bftriggers.get(block.toLowerCase())));
    }


    public static getKeyTriggers(block:string) : Map<string,TriggerDefinition>
    {
        return(new Map(TriggerDefinitions.bktriggers.get(block.toLowerCase())));
    }


    public static getFormFieldTriggers(form:string,block:string) : Map<string,TriggerDefinition>
    {
        let triggers:Map<string,Map<string,TriggerDefinition>> = TriggerDefinitions.fftriggers.get(form.toLowerCase());
        if (triggers != null) return(new Map(triggers.get(block.toLowerCase())));
        return(new Map());
    }


    public static getFormKeyTriggers(form:string) : Map<string,TriggerDefinition>
    {
        return(new Map(TriggerDefinitions.fktriggers.get(form.toLowerCase())));
    }


    private static split(name:string) : string[]
    {
        if (name == null) return([]);
        let tokens:string[] = name.trim().split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}
