import { Listener } from "./Listener";
import { TriggerEvent } from "./TriggerEvent";
import { TriggerEvents } from "./TriggerEvents";
import { InstanceListener } from "./InstanceListener";


export class Trigger
{
    public static Key:Trigger = new Trigger("Key");
    public static Lock:Trigger = new Trigger("Lock");
    public static Change:Trigger = new Trigger("Change");
    public static Typing:Trigger = new Trigger("Typing");
    public static PreField:Trigger = new Trigger("PreField");
    public static PostField:Trigger = new Trigger("PostField");
    public static PostChange:Trigger = new Trigger("PostChange");
    public static PreQuery:Trigger = new Trigger("PreQuery");
    public static PreInsert:Trigger = new Trigger("PreInsert");
    public static PreUpdate:Trigger = new Trigger("PreUpdate");
    public static PreDelete:Trigger = new Trigger("PreDelete");

    private constructor(public name:string) {};
}


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();

    public addListener(instance:any, listener:Listener, types:Trigger|Trigger[]) : void
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
                case Trigger.Key       : this.addKeyListener(instance,listener); break;
                case Trigger.PostField : this.addFieldListener(instance,listener,type); break;
                case Trigger.PreField  : this.addFieldListener(instance,listener,type); break;
                case Trigger.Change    : this.addFieldListener(instance,listener,type); break;
                case Trigger.Lock      : this.addFieldListener(instance,listener,type); break;
                case Trigger.Typing    : this.addFieldListener(instance,listener,type); break;
                case Trigger.PreQuery  : this.addEventListener(instance,listener,type); break;
                case Trigger.PreInsert : this.addEventListener(instance,listener,type); break;
                case Trigger.PreUpdate : this.addEventListener(instance,listener,type); break;
                case Trigger.PreDelete : this.addEventListener(instance,listener,type); break;

                default: console.log("Add Listener, unknown type: "+type);
            }
        });
    }


    private addEventListener(instance:any, listener:Listener, types:Trigger|Trigger[]) : void
    {
        let typesarr:Trigger[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as Trigger[];
        else       typesarr.push(types as Trigger);

        typesarr.forEach((type) =>
        {
            let lsnrs:InstanceListener[] = this.triggers.types.get(type.name);

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set(type.name,lsnrs);
            }

            lsnrs.push({inst: instance, lsnr: listener});
        });
    }


    public addKeyListener(instance:any, listener:Listener, keys?:string|string[]) : void
    {
        if (keys == null)
        {
            let lsnrs:InstanceListener[] = this.triggers.types.get(Trigger.Key.name);

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set(Trigger.Key.name,lsnrs);
            }

            lsnrs.push({inst: instance, lsnr: listener});
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
                key = key.toLowerCase();
                let lsnrs:InstanceListener[] = this.triggers.keys.get(key);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.keys.set(key,lsnrs);
                }

                lsnrs.push({inst: instance, lsnr: listener});
            });
        }
    }


    public addFieldListener(instance:any, listener:Listener, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        if (fields == null)
        {
            let typesarr:Trigger[] = [];
            let array:boolean = false;
            if (types.constructor.name == "Array") array = true;

            if (array) typesarr = types as Trigger[];
            else       typesarr.push(types as Trigger);

            typesarr.forEach((type) =>
            {
                let lsnrs:InstanceListener[] = this.triggers.types.get(type.name);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.types.set(type.name,lsnrs);
                }

                lsnrs.push({inst: instance, lsnr: listener});
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
                let lsnrs:InstanceListener[] = this.triggers.fields.get(field);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.fields.set(field,lsnrs);
                }

                lsnrs.push({inst: instance, lsnr: listener});
            });
        }
    }


    public async invokeTriggers(type:Trigger, arg:string, event:TriggerEvent) : Promise<boolean>
    {
        switch(type)
        {
            case Trigger.Key: return(this.invokeKeyTriggers(arg,event));
            case Trigger.PostField: return(this.invokeFieldTriggers(arg,event));
            case Trigger.PreField: return(this.invokeFieldTriggers(arg,event));
            case Trigger.Change: return(this.invokeFieldTriggers(arg,event));
            case Trigger.Lock: return(this.invokeFieldTriggers(arg,event));
            case Trigger.Typing: return(this.invokeFieldTriggers(arg,event));
            case Trigger.PreQuery: return(this.invokeFieldTriggers(arg,event));
            case Trigger.PreInsert: return(this.invokeFieldTriggers(arg,event));
            case Trigger.PreUpdate: return(this.invokeFieldTriggers(arg,event));
            case Trigger.PreDelete: return(this.invokeFieldTriggers(arg,event));

            default: console.log("Add Listener, unknown type: "+type);
        }

        return(true);
    }


    public async invokeKeyTriggers(key:string, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:InstanceListener[] = this.triggers.types.get(Trigger.Key.name);

        lsnrs = this.triggers.keys.get(key);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        lsnrs = this.triggers.types.get(Trigger.Key.name);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        return(true);
    }


    public async invokeFieldTriggers(field:string, event:TriggerEvent) : Promise<boolean>
    {
        let types:Trigger[] =
        [
            Trigger.PostField,
            Trigger.PreField,
            Trigger.Change,
            Trigger.Typing,
            Trigger.Lock
        ];

        let lsnrs:InstanceListener[] = null;;

        lsnrs = this.triggers.fields.get(field);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        types.forEach((type) =>
        {
            lsnrs = this.triggers.types.get(type.name);

            if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
            {
                if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                    return(false);
            });
        });

        return(true);
    }


    public async invokeCustomTriggers(type:Trigger, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:InstanceListener[] = null;;
        lsnrs = this.triggers.types.get(type.name);

        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        return(true);
    }
}