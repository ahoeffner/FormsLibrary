import { Key } from "./Key";
import { Block } from "./Block";
import { Field } from "../input/Field";
import { FieldData } from "./FieldData";
import { KeyMap } from "../keymap/KeyMap";
import { SQL } from "../database/Statement";
import { FormImpl } from "../forms/FormImpl";
import { Listener } from "../events/Listener";
import { Triggers } from "../events/Triggers";
import { Config } from "../application/Config";
import { Record, RecordState } from "./Record";
import { FormState } from "../forms/FormState";
import { FieldInstance } from "../input/FieldInstance";
import { EventListener } from "../events/EventListener";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { FieldDefinition } from "../input/FieldDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FieldTriggerEvent, KeyTriggerEvent, TriggerEvent } from "../events/TriggerEvent";


export class BlockImpl
{
    private alias$:string;
    private keymap:KeyMap;
    private row$:number = 0;
    private data$:FieldData;
    private offset:number = 0;
    private app:ApplicationImpl;
    private field$:FieldInstance;
    private form$:FormImpl = null;
    private dbusage:DatabaseUsage;
    private records$:Record[] = [];
    private details$:BlockImpl[] = [];
    private state:FormState = FormState.normal;
    private triggers:Triggers = new Triggers();
    private fielddef$:Map<string,FieldDefinition>;

    constructor(public block:Block) {}

    public get name() : string
    {
        return(this.block.constructor.name);
    }

    public set alias(alias:string)
    {
        this.alias$ = alias;
    }


    public get alias() : string
    {
        return(this.alias$);
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


    public set fielddef(def:Map<string,FieldDefinition>)
    {
        this.fielddef$ = def;
    }


    public get fielddef() : Map<string,FieldDefinition>
    {
        return(this.fielddef$);
    }


    public get clazz() : string
    {
        return(this.block.constructor.name.toLowerCase());
    }


    public get data() : FieldData
    {
        return(this.data$);
    }


    public set data(data:FieldData)
    {
        this.data$ = data;
    }


    public set config(conf:Config)
    {
        this.keymap = conf.keymap;
    }


    public set form(parent:FormImpl)
    {
        this.form$ = parent as FormImpl;
    }


    public focus() : void
    {
        if (this.field != null) this.field.focus();
        else this.records[this.row].focus();
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


    private keydelete() : boolean
    {
        if (!this.dbusage.delete) return(false);
        return(this.delete());
    }


    private keyentqry() : boolean
    {
        if (!this.dbusage.query) return(false);
        return(this.enterqry());
    }


    private async keyexeqry() : Promise<boolean>
    {
        if (!this.dbusage.query) return(false);
        return(this.executeqry());
    }


    public enterqry() : boolean
    {
        this.clear();
        if (this.records.length > 0)
        {
            this.state = FormState.entqry;
            this.records[0].enable(RecordState.entqry,false);
            this.records[0].focus();
        }

        return(true);
    }


    public async executeqry() : Promise<boolean>
    {
        let keys:Key[] = [];
        let fields:Field[] = [];

        if (this.state == FormState.entqry)
            fields = this.records[0].fields;

        let sql:SQL = this.data.parseQuery(keys,fields);


        return(true);
    }


    public insert(after:boolean) : boolean
    {
        let off:number = after ? 1 : 0;
        if (this.data == null) return(false);

        if (!this.data.insert(+this.row + +this.offset + +off))
            return(false);

        // Is first row
        if (this.data.rows == 1)
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


    public delete() : boolean
    {
        if (this.data == null) return(false);

        if (!this.data.delete(+this.row + +this.offset))
            return(false);

        this.clear();

        // current view is not full
        if (+this.data.rows - this.offset < this.rows)
        {
            this.offset--;
            if (this.offset < 0) this.offset = 0;
        }

        this.display(this.offset);

        // no records at current position
        if ((+this.row) + (+this.offset) >= this.data.rows)
            this.row = this.data.rows - this.offset - 1;

        if (this.data.rows == 0) this.records[0].clear(true);
        else this.goField(this.row,this.field);
    }


    public setValue(row:number, col:string, value:any, change:boolean) : void
    {
        if (this.data == null) return;
        this.data.update(+row+this.offset,col,value);
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
        if (this.data == null) return(true);
        return(true);
    }


    private async validaterecord() : Promise<boolean>
    {
        if (this.data == null) return(true);
        return(true);
    }


    public async clear()
    {
        for(let r = 0; r < this.rows; r++)
            this.records[r].clear();

        this.details$.forEach((block) => {block.clear()});
    }


    private async goField(row:number, field:FieldInstance) : Promise<boolean>
    {
        let rec:Record = this.getRecord(row);
        if (rec == null || !rec.enabled) return;

        rec.current = true;

        let inst:FieldInstance = rec.getFieldByGuid(field.name,field.guid);
        if (inst != null) inst.focus();
        else rec.focus();

        if (field.name == this.field.name && row == this.field.row)
        {
            this.onEvent(null,this.field,"focus");
        }
    }


    public async display(start:number)
    {
        this.offset = start;
        if (this.offset < 0) this.offset = 0;

        let columns:string[] = this.data.fields;
        let rows:any[][] = this.data.get(start,this.rows);

        for(let r = 0; r < rows.length; r++)
        {
            let rec:Record = this.getRecord(r);
            let status:RecordState = RecordState.update;
            if (this.data.isNew(start+r)) status = RecordState.insert;

            for(let c = 0; c < rows[r].length; c++)
            {
                let field:Field = rec.getField(columns[c]);
                if (field != null) field.value = rows[r][c];
            }

            rec.enable(status,false);
        }
    }


    public addListener(instance:any, listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        this.triggers.addListener(instance,listener,types,keys);
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string) : Promise<boolean>
    {
        let triggered:boolean = false;
        let trgevent:TriggerEvent = null;

        if (this.keymap == null)
            return(false);

        if (type == "focus")
        {
            if (this.row != field.row)
            {
                if (!await this.validaterecord())
                {
                    this.records[+this.row].current = true;
                    this.field.focus();
                    return(true);
                }
            }

            this.field$ = field;
            this.row = field.row;
            this.records$[+field.row].current = true;
            trgevent = new FieldTriggerEvent(event,field);
        }

        if (type == "change")
        {
            if (!await this.validatefield()) return(false);
            this.setValue(field.row,field.name,field.value,true);
            trgevent = new FieldTriggerEvent(event,field);
        }

        // Enter query
        if (type == "key" && key == this.keymap.enterquery)
        {
            if (!await this.validate()) return(false);

            triggered = true;
            trgevent = new KeyTriggerEvent(event,key,field);
            if (!await this.triggers.execute(type,key,trgevent)) return(true);

            this.keyentqry();
        }

        // Execute query
        if (type == "key" && key == this.keymap.executequery)
        {
            if (!await this.validate()) return(false);

            triggered = true;
            trgevent = new KeyTriggerEvent(event,key,field);
            if (!await this.triggers.execute(type,key,trgevent)) return(true);

            this.keyexeqry();
        }

        // Delete
        if (type == "key" && key == this.keymap.delete)
        {
            triggered = true;
            trgevent = new KeyTriggerEvent(event,key,field);
            if (!await this.triggers.execute(type,key,trgevent)) return(true);

            this.keydelete();
        }

        // Insert after
        if (type == "key" && key == this.keymap.insertafter)
        {
            if (!await this.validate()) return(false);
            this.setValue(field.row,field.name,field.value,true);

            triggered = true;
            trgevent = new KeyTriggerEvent(event,key,field);
            if (!await this.triggers.execute(type,key,trgevent)) return(true);

            this.keyinsert(true);
        }

        // Insert before
        if (type == "key" && key == this.keymap.insertbefore)
        {
            if (!await this.validate()) return(false);
            this.setValue(field.row,field.name,field.value,true);

            triggered = true;
            trgevent = new KeyTriggerEvent(event,key,field);
            if (!await this.triggers.execute(type,key,trgevent)) return(true);

            this.keyinsert(false);
        }

        // Next record
        if (type == "key" && key == this.keymap.nextrecord)
        {
            let row:number = +field.row + 1;
            if (this.data == null) return(false);

            if (+row >= +this.rows)
            {
                row = +this.rows - 1;
                if (this.data == null) return(false);

                let offset:number = +this.offset + +field.row;
                let fetched:number = await this.data.fetch(offset,1);

                if (fetched == 0) return(false);
                if (!await this.onEvent(null,this.field,"change")) return(false);

                this.display(this.offset+1);
            }
            else
            {
                if (field.current)
                if (!await this.onEvent(null,this.field,"change")) return(false);
            }

            this.goField(row,this.field);
        }

        // Previous record
        if (type == "key" && key == this.keymap.prevrecord)
        {
            let row:number = +field.row - 1;
            if (this.data == null) return(false);

            if (+row < 0)
            {
                row = 0;

                if (!await this.onEvent(null,this.field,"change"))
                    return(false);

                this.display(this.offset-1);
            }
            else
            {
                if (field.current)
                if (!await this.onEvent(null,this.field,"change")) return(false);
            }

            this.goField(row,this.field);
        }

        event["navigate"] = true;

        if (type == "key" && key == this.keymap.prevfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == this.keymap.nextfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        event["navigate"] = false;

        if (!triggered && type == "key")
            trgevent = new KeyTriggerEvent(event,key,field);

        // Pass event to subscribers, stop if signalled
        if (!await this.triggers.execute(type,key,trgevent))
            return(true);

        // Pass event on to parent (form)
        if (this.form != null)
            this.form.onEvent(event,field,type,key);

        return(true);
    }
}