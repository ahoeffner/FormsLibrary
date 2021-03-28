import { Listener } from "./Listener";
import { TriggerEvent } from "./TriggerEvent";
import { TriggerEvents } from "./TriggerEvents";
import { TriggerFunction } from "./TriggerFunction";


export class Trigger
{
    public static Key:Trigger           = new Trigger("Key");
    public static Lock:Trigger          = new Trigger("Lock");
    public static Change:Trigger        = new Trigger("Change");
    public static Typing:Trigger        = new Trigger("Typing");
    public static PreField:Trigger      = new Trigger("PreField");
    public static PostField:Trigger     = new Trigger("PostField");
    public static PostChange:Trigger    = new Trigger("PostChange");
    public static PreQuery:Trigger      = new Trigger("PreQuery");
    public static PreInsert:Trigger     = new Trigger("PreInsert");
    public static PreUpdate:Trigger     = new Trigger("PreUpdate");
    public static PreDelete:Trigger     = new Trigger("PreDelete");

    private constructor(public name:string) {};
}

export class FieldTrigger
{
    private static index:Map<string,Trigger> = null;

    public static Key:Trigger           = Trigger.Key;
    public static Change:Trigger        = Trigger.Change;
    public static Typing:Trigger        = Trigger.Typing;
    public static PreField:Trigger      = Trigger.PreField;
    public static PostField:Trigger     = Trigger.PostField;
    public static PostChange:Trigger    = Trigger.PostChange;

    public static isFieldTrigger(trigger:Trigger) : boolean
    {
        if (FieldTrigger.index == null)
        {
            FieldTrigger.index = new Map<string,Trigger>();

            FieldTrigger.index.set(Trigger.Key.name,Trigger.Key);
            FieldTrigger.index.set(Trigger.Change.name,Trigger.Change);
            FieldTrigger.index.set(Trigger.Typing.name,Trigger.Typing);
            FieldTrigger.index.set(Trigger.PreField.name,Trigger.PreField);
            FieldTrigger.index.set(Trigger.PostField.name,Trigger.PostField);
            FieldTrigger.index.set(Trigger.PostChange.name,Trigger.PostChange);
        }

        return(FieldTrigger.index.get(trigger.name) != null);
    }
}


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();

    public addFieldTrigger(instance:any, func:TriggerFunction, ttypes:FieldTrigger|FieldTrigger[], tfields?:string|string[], tkeys?:string|string[]) : void
    {
        let types:Trigger[] = [];
        let tasa:boolean = false;

        if (ttypes.constructor.name == "Array") tasa = true;

        if (tasa) types = ttypes as Trigger[];
        else      types.push(ttypes as Trigger);

        this.addTrigger(instance,func,types,tfields,tkeys);
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
                    else if (FieldTrigger.isFieldTrigger(type))
                    {
                        let lsnrs:Listener[] = triggers.get(type.name);

                        if (lsnrs == null)
                        {
                            lsnrs = [];
                            triggers.set(type.name,lsnrs);
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
                    let lsnrs:Listener[] = this.triggers.types.get(type.name);

                    if (lsnrs == null)
                    {
                        lsnrs = [];
                        this.triggers.types.set(type.name,lsnrs);
                    }

                    lsnrs.push({inst: instance, func: func});
                }
            });
        }
    }


    public async invokeTriggers(type:Trigger, event?:TriggerEvent, key?:string) : Promise<boolean>
    {
        if (type == Trigger.Key && key != null)
        {
            let lsnrs:Listener[] = this.triggers.types.get(key);

            if (lsnrs != null)
            {
                lsnrs.forEach(async (lsnr) =>
                {
                    if (!await lsnr.inst[lsnr.func.name](event))
                        return(false);
                });
            }
        }
        else
        {
            let lsnrs:Listener[] = this.triggers.types.get(type.name);

            if (lsnrs != null)
            {
                lsnrs.forEach(async (lsnr) =>
                {
                    if (!await lsnr.inst[lsnr.func.name](event))
                        return(false);
                });
            }
        }

        return(true);
    }


    public async invokeFieldTriggers(type:Trigger, field:string, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        let triggers:Map<string,Listener[]> = this.triggers.fields.get(field);
        if (triggers == null) return(true);

        if (type == Trigger.Key && key != null)
        {
            let lsnrs:Listener[] = triggers.get(key);

            if (lsnrs != null)
            {
                lsnrs.forEach(async (lsnr) =>
                {
                    if (!await lsnr.inst[lsnr.func.name](event))
                        return(false);
                });
            }
        }
        else
        {
            let lsnrs:Listener[] = triggers.get(type.name);

            if (lsnrs != null)
            {
                lsnrs.forEach(async (lsnr) =>
                {
                    if (!await lsnr.inst[lsnr.func.name](event))
                        return(false);
                });
            }
        }

        return(true);
    }
}