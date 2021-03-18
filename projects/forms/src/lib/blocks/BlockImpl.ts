import { Block } from "./Block";
import { Record } from "./Record";
import { Field } from "../input/Field";
import { TableData } from "./TableData";
import { KeyMap } from "../keymap/KeyMap";
import { Listener } from "../events/Listener";
import { Config } from "../application/Config";
import { FieldInstance } from "../input/FieldInstance";
import { EventListener } from "../events/EventListener";
import { InstanceEvents } from "../events/InstanceEvents";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { InstanceListener } from "../events/InstanceListener";
import { ApplicationImpl } from "../application/ApplicationImpl";


export class BlockImpl
{
    private name$:string;
    private keymap:KeyMap;
    private row$:number = 0;
    private table$:TableData;
    private offset:number = 0;
    private app:ApplicationImpl;
    private field$:FieldInstance;
    private parent$:EventListener;
    private dbusage:DatabaseUsage;
    private records$:Record[] = [];
    private listener:InstanceEvents = new InstanceEvents();

    constructor(public block:Block) {}

    public set name(alias:string)
    {
        this.name$ = alias;
    }


    public get name() : string
    {
        return(this.name$);
    }


    public set row(row:number)
    {
        this.row$ = row;
    }


    public get row() : number
    {
        return(this.row$);
    }


    public get rows() : number
    {
        return(this.records$.length);
    }


    public get field() : FieldInstance
    {
        return(this.field$);
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


    public get parent() : EventListener
    {
        return(this.parent$);
    }


    public set parent(parent:EventListener)
    {
        this.parent$ = parent;
    }


    public get records() : Record[]
    {
        return(this.records$);
    }


    public getRecord(row:number) : Record
    {
        if (row < this.records$.length)
            return(this.records$[+row]);

        return(null);
    }


    public getField(row:number, name:string) : Field
    {
        return(this.records[+row]?.getField(name));
    }


    public setValue(row:number, col:string, value:any, change:boolean) : void
    {
        if (this.table != null)
            this.table.update(+row+this.offset,col,value);
    }


    public addRecord(record:Record)
    {
        this.records.push(record);
        record.fields.forEach((inst) => {inst.block = this});
    }


    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.dbusage = usage;
    }


    public getDatabaseUsage() : DatabaseUsage
    {
        return(this.dbusage);
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public sendkey(event:any,key:string) : void
    {
        this.onEvent(event,this.field,"key",key);
    }


    private keyinsert(after:boolean) : boolean
    {
        if (!this.dbusage.insert) return(false);
        return(this.insert(after));
    }


    public insert(after:boolean) : boolean
    {
        let off:number = after ? 1 : 0;

        if (!this.table.insert(+this.row + +this.offset + +off))
            return(false);

        // Is first row
        if (this.table.rows == 1)
        {
            this.display(this.offset);
            return;
        }

        let scroll:number = 0;

        if (after && this.row == this.rows - 1)
            scroll = 1;

        if (!after && this.row == 0)
            scroll = -1;

        let move:number = 0;
        if (scroll == 0) move = after ? 1 : 0;

        this.display(+this.offset + scroll);

        this.row = +this.row + +move;
        let rec:Record = this.records[+this.row];
        rec.current = true;

        let field:FieldInstance = rec.getFieldByGuid(this.field.name,this.field.guid);
        if (field != null) field.focus();
    }


    private keydelete() : boolean
    {
        if (!this.dbusage.delete) return(false);
        return(this.delete());
    }


    public delete() : boolean
    {
        if (!this.table.delete(+this.row + +this.offset))
            return(false);

        this.clear();

        // current view is not full
        if (+this.table.rows - this.offset < this.rows)
        {
            this.offset--;
            if (this.offset < 0) this.offset = 0;
        }

        this.display(this.offset);

        // no records at current position
        if ((+this.row) + (+this.offset) >= this.table.rows)
            this.row = this.table.rows - this.offset - 1;

        if (this.table.rows == 0) this.records[0].clear(true);
        else this.goField(this.row,this.field);
    }


    public async validate() : Promise<boolean>
    {
        let rec:Record = this.records[this.row];
        if (!rec.enabled) return(true);

        if (!await this.validatefield())
            return(false);

        return(await this.validaterecord());
    }


    private async validatefield() : Promise<boolean>
    {
        return(true);
    }


    private async validaterecord() : Promise<boolean>
    {
        return(true);
    }


    public async clear()
    {
        for(let r = 0; r < this.rows; r++)
            this.records[r].clear();
    }


    private async goField(row:number, field:FieldInstance) : Promise<boolean>
    {
        let rec:Record = this.getRecord(row);
        if (rec == null || !rec.enabled) return;

        rec.current = true;

        let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
        if (inst != null) inst.focus();
        else rec.fields[0].focus();

        if (field.name == this.field.name && row == this.field.row)
        {
            this.onEvent(null,this.field,"focus");
        }
    }


    public async display(start:number)
    {
        this.offset = start;
        if (this.offset < 0) this.offset = 0;

        if (this.table != null)
        {
            let columns:string[] = this.table.columns;
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


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string) : Promise<boolean>
    {
        if (this.keymap == null)
            return(false);

        if (type == "focus")
        {
            if (this.row != field.row)
            {
                if (!this.validaterecord())
                {
                    this.records[+this.row].current = true;
                    this.field.focus();
                    return(true);
                }
            }

            this.field$ = field;
            this.row = field.row;
            this.records$[+field.row].current = true;
        }

        if (type == "change")
        {
            if (!this.validatefield()) return(false);
            this.setValue(field.row,field.name,field.value,true);
        }

        // Delete
        if (type == "key" && key == this.keymap.delete)
            this.keydelete();

        // Insert after
        if (type == "key" && key == this.keymap.insertafter)
        {
            if (!this.validate()) return(false);
            this.setValue(field.row,field.name,field.value,true);
            this.keyinsert(true);
        }

        // Insert before
        if (type == "key" && key == this.keymap.insertbefore)
        {
            if (!this.validate()) return(false);
            this.setValue(field.row,field.name,field.value,true);
            this.keyinsert(false);
        }

        // Next record
        if (type == "key" && key == this.keymap.nextrecord)
        {
            let row:number = +field.row + 1;

            if (+row >= +this.rows)
            {
                row = +this.rows - 1;
                if (this.table == null) return(false);

                let offset:number = +this.offset + +field.row;
                let fetched:number = await this.table$.fetch(offset,1);

                if (fetched == 0) return(false);
                if (!this.onEvent(null,this.field,"change")) return(false);

                this.display(this.offset+1);
            }
            else
            {
                if (field.current)
                if (!this.onEvent(null,this.field,"change")) return(false);
            }

            this.goField(row,this.field);
        }

        // Previous record
        if (type == "key" && key == this.keymap.prevrecord)
        {
            let row:number = +field.row - 1;

            if (+row < 0)
            {
                row = 0;
                if (this.table == null) return(false);

                if (!this.onEvent(null,this.field,"change"))
                    return(false);

                this.display(this.offset-1);
            }
            else
            {
                if (field.current)
                if (!this.onEvent(null,this.field,"change")) return(false);
            }

            this.goField(row,this.field);
        }

        // Pass event on to parent (form)
        if (this.parent != null)
            this.parent.onEvent(event,field,type,key);

        // Pass event to subscribers
        let lsnrs:InstanceListener[] = this.listener.types.get(type);
        if (lsnrs != null) lsnrs.forEach((ilsnr) =>
        {
            ilsnr.inst[ilsnr.lsnr.name](field.name,field.row,type,field.value,key);
        });

        if (type == "key")
        {
            lsnrs = this.listener.keys.get(key);
            if (lsnrs != null) lsnrs.forEach((ilsnr) =>
            {
                ilsnr.inst[ilsnr.lsnr.name](field.name,field.row,type,field.value,key);
            });
        }

        return(true);
    }
}