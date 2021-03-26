import { Listener } from "./Listener";
import { TriggerEvent } from "./TriggerEvent";
import { TriggerEvents } from "./TriggerEvents";
import { InstanceListener } from "./InstanceListener";


export class Triggers
{
    private triggers:TriggerEvents = new TriggerEvents();

    public addListener(instance:any, listener:Listener, types:string|string[]) : void
    {
        let typesarr:string[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as string[];
        else       typesarr.push(types as string);

        typesarr.forEach((type) =>
        {
            type = type.toLowerCase();

            switch(type)
            {
                case "key"       : this.addKeyListener(instance,listener); break;
                case "blur"      : this.addFieldListener(instance,listener,type); break;
                case "focus"     : this.addFieldListener(instance,listener,type); break;
                case "change"    : this.addFieldListener(instance,listener,type); break;
                case "fchange"   : this.addFieldListener(instance,listener,type); break;
                case "ichange"   : this.addFieldListener(instance,listener,type); break;
                case "prequery"  : this.addEventListener(instance,listener,type); break;
                case "preinsert" : this.addEventListener(instance,listener,type); break;
                case "preupdate" : this.addEventListener(instance,listener,type); break;
                case "predelete" : this.addEventListener(instance,listener,type); break;

                default: console.log("Add Listener, unknown type: "+type);
            }
        });
    }


    public addEventListener(instance:any, listener:Listener, types:string|string[]) : void
    {
        let typesarr:string[] = [];
        let array:boolean = false;
        if (types.constructor.name == "Array") array = true;

        if (array) typesarr = types as string[];
        else       typesarr.push(types as string);

        typesarr.forEach((type) =>
        {
            type = type.toLowerCase();
            let lsnrs:InstanceListener[] = this.triggers.types.get(type);

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set(type,lsnrs);
            }

            lsnrs.push({inst: instance, lsnr: listener});
        });
    }


    public addKeyListener(instance:any, listener:Listener, keys?:string|string[]) : void
    {
        if (keys == null)
        {
            let lsnrs:InstanceListener[] = this.triggers.types.get("key");

            if (lsnrs == null)
            {
                lsnrs = [];
                this.triggers.types.set("key",lsnrs);
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


    public addFieldListener(instance:any, listener:Listener, types:string|string[], fields?:string|string[]) : void
    {
        if (fields == null)
        {
            let typesarr:string[] = [];
            let array:boolean = false;
            if (types.constructor.name == "Array") array = true;

            if (array) typesarr = types as string[];
            else       typesarr.push(types as string);

            typesarr.forEach((type) =>
            {
                type = type.toLowerCase();
                let lsnrs:InstanceListener[] = this.triggers.types.get(type);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.triggers.types.set(type,lsnrs);
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


    public async invokeTriggers(type:string, arg:string, event:TriggerEvent) : Promise<boolean>
    {
        switch(type)
        {
            case "key": return(this.invokeKeyTriggers(arg,event));
            case "blur": return(this.invokeFieldTriggers(arg,event));
            case "focus": return(this.invokeFieldTriggers(arg,event));
            case "change": return(this.invokeFieldTriggers(arg,event));
            case "fchange": return(this.invokeFieldTriggers(arg,event));
            case "ichange": return(this.invokeFieldTriggers(arg,event));
            case "prequery": return(this.invokeFieldTriggers(arg,event));
            case "preinsert": return(this.invokeFieldTriggers(arg,event));
            case "preupdate": return(this.invokeFieldTriggers(arg,event));
            case "predelete": return(this.invokeFieldTriggers(arg,event));

            default: console.log("Add Listener, unknown type: "+type);
        }

        return(true);
    }


    public async invokeKeyTriggers(key:string, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:InstanceListener[] = this.triggers.types.get("key");

        lsnrs = this.triggers.keys.get(key);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        lsnrs = this.triggers.types.get("key");
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        return(true);
    }


    public async invokeFieldTriggers(field:string, event:TriggerEvent) : Promise<boolean>
    {
        let types:string[] = ["blur","focus","change","ichange","fchange"];
        let lsnrs:InstanceListener[] = null;;

        lsnrs = this.triggers.fields.get(field);
        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        types.forEach((type) =>
        {
            lsnrs = this.triggers.types.get(type);

            if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
            {
                if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                    return(false);
            });
        });

        return(true);
    }


    public async invokeCustomTriggers(type:string, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:InstanceListener[] = null;;
        lsnrs = this.triggers.types.get(type);

        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            if (!await ilsnr.inst[ilsnr.lsnr.name](event))
                return(false);
        });

        return(true);
    }
}