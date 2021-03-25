import { Listener } from "./Listener";
import { TriggerEvent } from "./TriggerEvent";
import { InstanceEvents } from "./InstanceEvents";
import { InstanceListener } from "./InstanceListener";


export class Triggers
{
    private listener:InstanceEvents = new InstanceEvents();

    public addListener(instance:any, listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        if (types != null)
        {
            let typesarr:string[] = [];
            let array:boolean = false;
            if (types.constructor.name == "Array") array = true;

            if (array) typesarr = types as string[];
            else       typesarr.push(types as string);

            typesarr.forEach((type) =>
            {
                type = type.toLowerCase();

                if (type != "key" || keys == null)
                {
                    let lsnrs:InstanceListener[] = this.listener.types.get(type);

                    if (lsnrs == null)
                    {
                        lsnrs = [];
                        this.listener.types.set(type,lsnrs);
                    }

                    lsnrs.push({inst: instance, lsnr: listener});
                }
            });
        }

        if (keys != null)
        {
            let keysarr:string[] = [];
            let array:boolean = false;
            if (keys.constructor.name == "Array") array = true;

            if (array) keysarr = keys as string[];
            else       keysarr.push(keys as string);

            keysarr.forEach((key) =>
            {
                key = key.toLowerCase();
                let lsnrs:InstanceListener[] = this.listener.keys.get(key);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.listener.keys.set(key,lsnrs);
                }

                lsnrs.push({inst: instance, lsnr: listener});
            });
        }
    }


    public async execute(type:string, key:string, event:TriggerEvent) : Promise<boolean>
    {
        let lsnrs:InstanceListener[] = this.listener.types.get(type);

        if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
        {
            await ilsnr.inst[ilsnr.lsnr.name](event);
        });

        if (type == "key")
        {
            lsnrs = this.listener.keys.get(key);
            if (lsnrs != null) lsnrs.forEach(async (ilsnr) =>
            {
                await ilsnr.inst[ilsnr.lsnr.name](event);
            });
        }

        return(true);
    }
}