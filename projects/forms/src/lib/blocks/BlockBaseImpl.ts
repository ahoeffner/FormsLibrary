import { Field } from "../input/Field";
import { BlockBase } from "./BlockBase";
import { Record } from "../blocks/Record";
import { KeyMap } from "../keymap/KeyMap";
import { Listener } from "../events/Listener";
import { Config } from "../application/Config";
import { FieldInstance } from "../input/FieldInstance";


interface InstListener
{
    inst:any;
    lsnr:Listener;
}

interface FieldGroup
{
    name:string;
    fields:FieldInstance[];
}


class EventListener
{
    keys:Map<string,InstListener[]> = new Map<string,InstListener[]>();
    types:Map<string,InstListener[]> = new Map<string,InstListener[]>();
}


export class BlockBaseImpl
{
    private name$:string;
    private class$:string;
    private keymap:KeyMap;
    private fields$:FieldInstance[] = [];
    private listener:EventListener = new EventListener();
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

    public hash() : void
    {
        this.rehash();
    }

    public rehash(groups?:string[]) : void
    {
        let seq:number = 1;
        if (groups == null) groups = [];

        let index:Map<string,FieldInstance[]> = new Map<string,FieldInstance[]>();

        this.fields$.forEach((field) =>
        {
            let group:FieldInstance[] = index.get(field.group);

            if (group == null)
            {
                group = [];
                index.set(field.group,group);

                let exists:boolean = false;
                for(let i = 0; i < groups.length; i++)
                {
                    if (groups[i] == field.group)
                    {
                        exists = true;
                        break;
                    }
                }

                if (!exists) groups.push(field.group);
            }

            group.push(field);
        });

        groups.forEach((name) =>
        {
            let group:FieldInstance[] = index.get(name);
            if (group != null) {group.forEach((field) => {field.seq = seq++});}
        });
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
                    let lsnrs:InstListener[] = this.listener.types.get(type);

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
                let lsnrs:InstListener[] = this.listener.keys.get(key);

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

        if (type == "key" && key == this.keymap.prevfield)
            if (field.seq == 1) event.preventDefault();

        if (type == "key" && key == this.keymap.nextfield)
            if (field.seq == this.fields$.length) event.preventDefault();

        let lsnrs:InstListener[] = this.listener.types.get(type);
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