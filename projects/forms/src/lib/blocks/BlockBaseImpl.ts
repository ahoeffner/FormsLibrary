import { Field } from "../input/Field";
import { BlockBase } from "./BlockBase";
import { Record } from "../blocks/Record";
import { KeyMap } from "../keymap/KeyMap";
import { Listener } from "../events/Listener";
import { Config } from "../application/Config";
import { FieldInstance } from "../input/FieldInstance";
import { EventListener } from "../events/EventListener";
import { InstanceEvents } from "../events/InstanceEvents";
import { InstanceListener } from "../events/InstanceListener";


export class BlockBaseImpl
{
    private name$:string;
    private class$:string;
    private keymap:KeyMap;
    private parent$:EventListener;
    private fields$:FieldInstance[] = [];
    private listener:InstanceEvents = new InstanceEvents();
    private records:Map<number,Record> = new Map<number,Record>();

    constructor(private block:BlockBase) {}

    public set name(alias:string)
    {
        this.name$ = alias;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public set clazz(cname:string)
    {
        this.class$ = cname.toLowerCase();
    }

    public get clazz() : string
    {
        return(this.class$);
    }

    public set config(conf:Config)
    {
        this.keymap = conf.keymap;
    }

    public set parent(parent:EventListener)
    {
        this.parent$ = parent;
    }

    public getRecord(row:number) : Record
    {
        return(this.records.get(+row));
    }

    public addRecord(record:Record) : void
    {
        this.records.set(+record.row,record);
        record.fields.forEach((field) => {field.block = this});
    }

    public set fields(fields:FieldInstance[])
    {
        this.fields$ = fields;
    }

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
    }

    public getField(row:number, name:string) : Field
    {
        return(this.records.get(+row)?.getField(name));
    }

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

    public onEvent(event:any, field:FieldInstance, type:string, key?:string) : void
    {
        if (this.keymap == null)
            return;

        if (type == "focus")
            this.records.get(+field.row).current = true;

        if (this.parent$ != null)
            this.parent$.onEvent(event,field,type,key);

        let lsnrs:InstanceListener[] = this.listener.types.get(type);
        if (lsnrs != null) lsnrs.forEach((ilsnr) =>
        {
            ilsnr.inst[ilsnr.lsnr.name](field,type);
        });

        if (type == "key")
        {
            lsnrs = this.listener.keys.get(key);
            if (lsnrs != null) lsnrs.forEach((ilsnr) =>
            {
                ilsnr.inst[ilsnr.lsnr.name](field,type,key);
            });
        }
    }
}