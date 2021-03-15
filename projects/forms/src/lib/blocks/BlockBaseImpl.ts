import { Field } from "../input/Field";
import { TableData } from "./TableData";
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
    private keymap:KeyMap;
    private rows$:number = 0;
    private table$:TableData;
    private parent$:EventListener;
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

    public get rows() : number
    {
        return(this.rows$);
    }

    public get clazz() : string
    {
        return(this.block.constructor.name.toLowerCase());
    }

    public set table(table:TableData)
    {
        this.table$ = table;
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
        if (+record.row > this.rows$) this.rows$ = +record.row;
        record.fields.forEach((field) => {field.block = this});
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

        if (type == "key" && key == this.keymap.nextrecord)
        {
            let rec:Record = this.getRecord(field.row+1);
            if (rec == null)
            {
                console.log("last-record");
            }
            else
            {
                let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
                if (inst == null) rec.current = true;
                else
                {
                    rec.current = true;
                    inst.focus();
                }
            }
        }

        if (type == "key" && key == this.keymap.prevrecord)
        {
            let rec:Record = this.getRecord(field.row-1);
            if (rec == null)
            {
                console.log("first-record");
            }
            else
            {
                let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
                if (inst == null) rec.current = true;
                else
                {
                    rec.current = true;
                    inst.focus();
                }
            }
        }


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