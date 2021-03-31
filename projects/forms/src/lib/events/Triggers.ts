import { Listener } from "./Listener";
import { TriggerEvent } from "./TriggerEvent";
import { TriggerEvents } from "./TriggerEvents";
import { TriggerFunction } from "./TriggerFunction";


export class Trigger
{
    public static Key:Trigger                   = new Trigger("Key");
    public static Lock:Trigger                  = new Trigger("Lock");
    public static Typing:Trigger                = new Trigger("Typing");
    public static PreField:Trigger              = new Trigger("PreField");
    public static PostField:Trigger             = new Trigger("PostField");
    public static PostChange:Trigger            = new Trigger("PostChange");
    public static WhenValidateField:Trigger     = new Trigger("WhenValidateField");
    public static WhenValidateRecord:Trigger    = new Trigger("WhenValidateRecord");
    public static PreQuery:Trigger              = new Trigger("PreQuery");
    public static PreInsert:Trigger             = new Trigger("PreInsert");
    public static PreUpdate:Trigger             = new Trigger("PreUpdate");
    public static PreDelete:Trigger             = new Trigger("PreDelete");

    private constructor(public name:string) {};
}

export class FieldTrigger
{
    private static index:Map<string,boolean> = null;

    public static Key:Trigger                   = Trigger.Key;
    public static Typing:Trigger                = Trigger.Typing;
    public static PreField:Trigger              = Trigger.PreField;
    public static PostField:Trigger             = Trigger.PostField;
    public static PostChange:Trigger            = Trigger.PostChange;
    public static ValidateField:Trigger         = Trigger.WhenValidateField;

    public static isFieldTrigger(trigger:Trigger) : boolean
    {
        if (FieldTrigger.index == null)
        {
            FieldTrigger.index = new Map<string,boolean>();

            FieldTrigger.index.set(Trigger.Key.name,true);
            FieldTrigger.index.set(Trigger.Typing.name,true);
            FieldTrigger.index.set(Trigger.PreField.name,true);
            FieldTrigger.index.set(Trigger.PostField.name,true);
            FieldTrigger.index.set(Trigger.PostChange.name,true);
            FieldTrigger.index.set(Trigger.WhenValidateField.name,true);
        }

        return(FieldTrigger.index.has(trigger.name));
    }
}


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();


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


    public async invokeTriggers(type:Trigger, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        event.type = type.name;

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
            let lsnrs:Listener[] = this.triggers.types.get(type.name);

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

        event.type = type.name;

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
            let lsnrs:Listener[] = triggers.get(type.name);

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
}