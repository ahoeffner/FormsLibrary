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


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();

    public addTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        let typesarr:Trigger[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as Trigger[];
        else       typesarr.push(types as Trigger);

        typesarr.forEach((type) =>
        {
            switch(type)
            {
                case Trigger.Key       : this.addKeyTrigger(instance,func); break;
                case Trigger.PostField : this.addFieldTrigger(instance,func,type); break;
                case Trigger.PreField  : this.addFieldTrigger(instance,func,type); break;
                case Trigger.Change    : this.addFieldTrigger(instance,func,type); break;
                case Trigger.Lock      : this.addFieldTrigger(instance,func,type); break;
                case Trigger.Typing    : this.addFieldTrigger(instance,func,type); break;
                case Trigger.PreQuery  : this.addEventTrigger(instance,func,type); break;
                case Trigger.PreInsert : this.addEventTrigger(instance,func,type); break;
                case Trigger.PreUpdate : this.addEventTrigger(instance,func,type); break;
                case Trigger.PreDelete : this.addEventTrigger(instance,func,type); break;

                default: console.log("Add Listener, unknown type: "+type);
            }
        });
    }


    private addEventTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        let typesarr:Trigger[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as Trigger[];
        else       typesarr.push(types as Trigger);

        typesarr.forEach((type) =>
        {
            let lsnrs:Listener[] = this.triggers.types.get(type.name);

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set(type.name,lsnrs);
            }

            lsnrs.push({inst: instance, func: func});
        });
    }


    public addKeyTrigger(instance:any, func:TriggerFunction, keys?:string|string[]) : void
    {
        if (keys == null)
        {
            let lsnrs:Listener[] = this.triggers.types.get(Trigger.Key.name);

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set(Trigger.Key.name,lsnrs);
            }

            lsnrs.push({inst: instance, func: func});
        }
        else
        {
            let keysarr:string[] = [];
            let array:boolean = false;
            if (keys.constructor.name == "Array") array = true;

            if (array) keysarr = keys as string[];
            else       keysarr.push(keys as string);

            keysarr.forEach((key) =>
            {
                let lsnrs:Listener[] = this.triggers.keys.get(key);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.keys.set(key,lsnrs);
                }

                lsnrs.push({inst: instance, func: func});
            });
        }
    }


    public addFieldTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        let typesarr:Trigger[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as Trigger[];
        else       typesarr.push(types as Trigger);

        if (fields == null)
        {
            typesarr.forEach((type) =>
            {
                let lsnrs:Listener[] = this.triggers.types.get(type.name);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.types.set(type.name,lsnrs);
                }

                lsnrs.push({inst: instance, func: func});
            });
        }
        else
        {
            let fieldsarr:string[] = [];
            let array:boolean = false;
            if (fields.constructor.name == "Array") array = true;

            if (array) fieldsarr = fields as string[];
            else       fieldsarr.push(fields as string);

            fieldsarr.forEach((field) =>
            {
                field = field.toLowerCase();
                let lsnrs:Listener[] = this.triggers.fields.get(field);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    console.log("adFieldTrigger for field "+field);
                    this.triggers.fields.set(field,lsnrs);
                }

                typesarr.forEach((type) =>
                {
                    lsnrs.push({inst: instance, func: func, type: type});
                });
            });
        }
    }


    public async invokeTriggers(type:Trigger, arg:string, event:TriggerEvent) : Promise<boolean>
    {
        if (type == Trigger.Key)
            return(this.invokeKeyTriggers(arg,event));

        console.log("type: "+type.name+" arg = "+arg);
        if
        (
            type == Trigger.PostField   ||
            type == Trigger.PreField    ||
            type == Trigger.Change      ||
            type == Trigger.Lock        ||
            type == Trigger.Typing      ||
            type == Trigger.PreQuery    ||
            type == Trigger.PreInsert   ||
            type == Trigger.PreUpdate   ||
            type == Trigger.PreDelete
        )
        return(this.invokeFieldTriggers(arg,event,type));

        return(true);
    }


    public async invokeKeyTriggers(key:string, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:Listener[] = this.triggers.keys.get(key);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.func.name](event))
                return(false);
        });

        lsnrs = this.triggers.types.get(Trigger.Key.name);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.func.name](event))
                return(false);
        });

        return(true);
    }


    public async invokeFieldTriggers(field:string, event:TriggerEvent, types:Trigger|Trigger[]) : Promise<boolean>
    {
        let lsnrs:Listener[] = null;
        if (field != null) field = field.toLowerCase();

        this.triggers.fields.forEach((trg,field) => {console.log(field+" "+trg[0].field)});

        lsnrs = this.triggers.fields.get(field);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            console.log("invokeFieldTriggers "+field);
            if (!await ilsnr.inst[ilsnr.func.name](event))
                return(false);
        });

        let typesarr:Trigger[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as Trigger[];
        else       typesarr.push(types as Trigger);

        typesarr.forEach((type) =>
        {
            lsnrs = this.triggers.types.get(type.name);

            if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
            {
                if (!await ilsnr.inst[ilsnr.func.name](event))
                    return(false);
            });
        });

        return(true);
    }


    public async invokeCustomTriggers(type:Trigger, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:Listener[] = null;;
        lsnrs = this.triggers.types.get(type.name);

        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.func.name](event))
                return(false);
        });

        return(true);
    }
}