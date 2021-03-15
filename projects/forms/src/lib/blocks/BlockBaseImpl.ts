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
    private table$:TableData;
    private offset:number = 0;
    private parent$:EventListener;
    private records$:Record[] = [];
    private listener:InstanceEvents = new InstanceEvents();

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
        return(this.records$.length);
    }

    public get clazz() : string
    {
        return(this.block.constructor.name.toLowerCase());
    }

    public get table() : TableData
    {
        return(this.table$);
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
        if (row < this.records$.length)
            return(this.records$[+row]);

        return(null);
    }

    public getField(row:number, name:string) : Field
    {
        return(this.records$[+row]?.getField(name));
    }

    public setValue(row:number, col:string, value:any, change:boolean) : void
    {
        if (this.table$ != null)
            this.table$.set(+row+this.offset,col,value);
    }

    public addRecord(record:Record)
    {
        this.records$.push(record);
        record.fields.forEach((inst) => {inst.block = this});
    }

    public async display(start:number)
    {
        this.offset = start;

        if (this.table$ != null)
        {
            let columns:string[] = this.table$.columns;
            let rows:any[][] = this.table$.get(start,this.rows);

            for(let r = 0; r < rows.length; r++)
            {
                let rec:Record = this.getRecord(r);
                for(let c = 0; c < rows[r].length; c++)
                {
                    let field:Field = rec.getField(columns[c]);
                    field.value = rows[r][c];
                    rec.enable(false);
                }
            }
        }
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
            this.records$[+field.row].current = true;

        if (type == "change")
            this.setValue(field.row,field.name,field.value,true);

        if (type == "key" && key == this.keymap.nextrecord)
        {
            let rec:Record = this.getRecord(+field.row+1);
            if (rec == null || !rec.enabled)
            {
                if (this.table$ != null)
                {
                    let fetched:number = this.table$.fetch(1);
                    if (fetched > 0) this.display(this.offset+1);
                    this.records$[this.records$.length-1].current = true;
                }
            }
            else
            {
                let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
                if (inst != null) inst.focus();
                rec.current = true;
            }
        }

        if (type == "key" && key == this.keymap.prevrecord)
        {
            if (+field.row == 0)
            {
                if (this.table$ != null && this.offset > 0)
                {
                    this.display(this.offset-1);
                    this.records$[0].current = true;
                }
            }
            else
            {
                let rec:Record = this.getRecord(+field.row-1);
                let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
                if (inst != null) inst.focus();
                rec.current = true;
            }
        }

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