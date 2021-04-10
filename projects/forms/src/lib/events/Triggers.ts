import { Listener } from "./Listener";
import { KeyMapper } from "../keymap/KeyMap";
import { TriggerEvent } from "./TriggerEvent";
import { TriggerEvents } from "./TriggerEvents";
import { TriggerFunction } from "./TriggerFunction";


export enum Trigger
{
    Key,
    Lock,
    Typing,
    MouseClick,
    MouseDoubleClick,
    PreField,
    PostField,
    PostChange,
    WhenValidateField,
    WhenValidateRecord,
    PreQuery,
    PreInsert,
    PreUpdate,
    PreDelete
}

export enum FieldTrigger
{
    Key,
    Typing,
    MouseClick,
    MouseDoubleClick,
    PreField,
    PostField,
    PostChange,
    WhenValidateField,
    WhenValidateRecord
}


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();
    private static fieldtriggers:Set<string> = null;

    private static init() : void
    {
        if (Triggers.fieldtriggers == null)
        {
            Triggers.fieldtriggers = new Set<string>();

            Object.keys(FieldTrigger).forEach((type) =>
            {
                if (isNaN(Number(type)))
                    Triggers.fieldtriggers.add(type);
            });
        }
    }

    public addTrigger(instance:any, func:TriggerFunction, ttypes:Trigger|Trigger[], tfields?:string|string[], tkeys?:string|string[]) : void
    {
        let keys:string[] = [];
        let fields:string[] = [];
        let types:Trigger[] = [];

        let tasa:boolean = false;
        if (ttypes.constructor.name == "Array") tasa = true;

        if (tasa) types = ttypes as Trigger[];
        else      types.push(ttypes as Trigger);

        if (tfields != null)
        {
            let fasa:boolean = false;
            if (tfields.constructor.name == "Array") fasa = true;

            if (fasa) fields = tfields as string[];
            else      fields.push(tfields as string);
        }

        if (tkeys != null)
        {
            let kasa:boolean = false;
            if (tkeys.constructor.name == "Array") kasa = true;

            if (kasa) keys = tkeys as string[];
            else      keys.push(tkeys as string);

            keys.forEach((key) =>
            {
                if (!KeyMapper.ismap(key))
                    console.log("key '"+key+"' is not a key. use keymap.<keytype>");
            });
        }

        if (fields.length > 0)
        {
            fields.forEach((field) =>
            {
                field = field.toLowerCase();
                let triggers:Map<string,Listener[]> = this.triggers.fields.get(field);

                if (triggers == null)
                {
                    triggers = new Map<string,Listener[]>();
                    this.triggers.fields.set(field,triggers);
                }

                types.forEach((type) =>
                {
                    if (type == Trigger.Key)
                    {
                        keys.forEach((key) =>
                        {
                            let lsnrs:Listener[] = triggers.get(key);

                            if (lsnrs == null)
                            {
                                lsnrs = [];
                                triggers.set(key,lsnrs);
                            }

                            lsnrs.push({inst: instance, func: func});
                        });
                    }
                    else if (this.isFieldTrigger(type))
                    {
                        let name:string = this.name(type);
                        let lsnrs:Listener[] = triggers.get(name);

                        if (lsnrs == null)
                        {
                            lsnrs = [];
                            triggers.set(name,lsnrs);
                        }

                        lsnrs.push({inst: instance, func: func});
                    }
                });
            });
        }
        else
        {
            types.forEach((type) =>
            {
                if (type == Trigger.Key)
                {
                    keys.forEach((key) =>
                    {
                        let lsnrs:Listener[] = this.triggers.types.get(key);

                        if (lsnrs == null)
                        {
                            lsnrs = [];
                            this.triggers.types.set(key,lsnrs);
                        }

                        lsnrs.push({inst: instance, func: func});
                    });
                }
                else
                {
                    let name:string = this.name(type);
                    let lsnrs:Listener[] = this.triggers.types.get(name);

                    if (lsnrs == null)
                    {
                        lsnrs = [];
                        this.triggers.types.set(name,lsnrs);
                    }

                    lsnrs.push({inst: instance, func: func});
                }
            });
        }
    }


    public async invokeTriggers(type:Trigger, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        event["type$"] = this.name(type);

        if (type == Trigger.Key && key != null)
        {
            let lsnrs:Listener[] = this.triggers.types.get(key);

            if (lsnrs != null)
            {
                for(let i = 0; i < lsnrs.length; i++)
                    if (!await this.execfunc(lsnrs[i],event)) return(false);
            }
        }
        else
        {
            let name:string = this.name(type);
            let lsnrs:Listener[] = this.triggers.types.get(name);

            if (lsnrs != null)
            {
                for(let i = 0; i < lsnrs.length; i++)
                    if (!await this.execfunc(lsnrs[i],event)) return(false);
            }
        }

        return(true);
    }


    public async invokeFieldTriggers(type:Trigger, field:string, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        let triggers:Map<string,Listener[]> = this.triggers.fields.get(field);
        if (triggers == null) return(true);

        event["type$"] = this.name(type);

        if (type == Trigger.Key && key != null)
        {
            let lsnrs:Listener[] = triggers.get(key);

            if (lsnrs != null)
            {
                for(let i = 0; i < lsnrs.length; i++)
                    if (!await this.execfunc(lsnrs[i],event)) return(false);
            }
        }
        else
        {
            let name:string = this.name(type);
            let lsnrs:Listener[] = triggers.get(name);

            if (lsnrs != null)
            {
                for(let i = 0; i < lsnrs.length; i++)
                    if (!await this.execfunc(lsnrs[i],event)) return(false);
            }
        }

        return(true);
    }


    private async execfunc(lsnr:Listener, event:TriggerEvent) : Promise<boolean>
    {
        try
        {
            return(await lsnr.inst[lsnr.func.name](event));
        }
        catch (error)
        {
            console.log(error);
            return(false);
        }
    }


    private isFieldTrigger(trigger:Trigger)
    {
        Triggers.init();
        return(Triggers.fieldtriggers.has(Trigger[trigger]));
    }


    private name(trigger:Trigger) : string
    {
        return(Trigger[trigger].toLowerCase());
    }
}