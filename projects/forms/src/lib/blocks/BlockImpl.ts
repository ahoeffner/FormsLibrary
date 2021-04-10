import { Key } from "./Key";
import { Block } from "./Block";
import { Field } from "../input/Field";
import { FieldData } from "./FieldData";
import { FormImpl } from "../forms/FormImpl";
import { Record, RecordState } from "./Record";
import { FormState } from "../forms/FormState";
import { MessageBox } from "../popup/MessageBox";
import { Statement } from "../database/Statement";
import { keymap, KeyMapper } from "../keymap/KeyMap";
import { FieldInstance } from "../input/FieldInstance";
import { Trigger, Triggers } from "../events/Triggers";
import { ListOfValues } from "../listval/ListOfValues";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { TriggerFunction } from "../events/TriggerFunction";
import { LOVDefinition } from "../annotations/LOVDefinitions";
import { ListOfValuesImpl } from "../listval/ListOfValuesImpl";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FieldTriggerEvent, KeyTriggerEvent, SQLTriggerEvent, TriggerEvent } from "../events/TriggerEvent";


export class BlockImpl
{
    private name$:string;
    private alias$:string;
    private row$:number = 0;
    private data$:FieldData;
    private offset:number = 0;
    private app:ApplicationImpl;
    private field$:FieldInstance;
    private form$:FormImpl = null;
    private ready$:boolean = false;
    private dbusage$:DatabaseUsage;
    private records$:Record[] = [];
    private navigable$:boolean = true;
    private details$:BlockImpl[] = [];
    private fields$:FieldInstance[] = [];
    private lovs:Map<string,LOVDefinition>;
    private idlovs:Map<string,LOVDefinition>;
    private triggers:Triggers = new Triggers();
    private state:FormState = FormState.normal;


    constructor(public block?:Block)
    // Can be used as standalone (null)
    {
        this.dbusage$ =
        {
            query: false,
            update: true,
            insert: false,
            delete: false
        };

        if (block != null)
        {
            this.name$ = block.constructor.name;
            if (this.name$ == "Block") this.name$ = "anonymous";
        }
    }


    public get name() : string
    {
        return(this.name$);
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


    public get columns() : string[]
    {
        if (this.data == null) return(null);
        else return(this.data.columns);
    }


    public get ready()
    {
        return(this.ready$);
    }


    public set ready(ready:boolean)
    {
        this.ready$ = ready;
        let rec:Record = this.getRecord(0);

        if (rec != null)
        {
            rec.enable(true);
            rec.current = true;
        }
    }


    public get navigable()
    {
        return(this.navigable$);
    }


    public set navigable(navigable:boolean)
    {
        this.navigable$ = navigable;
    }


    public get record() : number
    {
        return(+this.row+this.offset);
    }


    public get fetched() : number
    {
        if (this.data == null) return(0);
        return(this.data.fetched);
    }


    public get field() : FieldInstance
    {
        return(this.field$);
    }


    public setFields(fields:FieldInstance[])
    {
        this.fields$ = fields;
    }


    public get fields() : string[]
    {
        if (this.data == null) return(null);
        else return(this.data.fields);
    }


    public get clazz() : string
    {
        if (this.block == null) return(null);
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


    public set form(form:FormImpl)
    {
        this.form$ = form;
    }


    public get form() : FormImpl
    {
        return(this.form$);
    }


    public setListOfValues(lovs:Map<string,LOVDefinition>) : void
    {
        this.lovs = lovs;
    }


    public setIdListOfValues(lovs:Map<string,LOVDefinition>) : void
    {
        this.idlovs = lovs;
    }


    public get querymode() : boolean
    {
        return(this.state == FormState.entqry);
    }


    public focus(row?:number) : void
    {
        if (!this.navigable) return;

        if (row != null && row >= 0 && row < this.rows)
        {
            if (this.records[+row]?.enabled)
            {
                this.row = row;
                this.records[+row].current = true;
            }
        }

        let rec:Record = this.records[this.row];

        if (this.field != null)
        {
            let field:Field = rec.getField(this.field.name);
            let inst:FieldInstance = rec.getFieldByGuid(this.field.name,this.field.guid);

            if (inst?.focus()) return;
            if (field?.focus()) return;
        }

        for(let i = 0; i < this.fields$.length; i++)
        {
            if (this.fields$[i].row == this.row)
                if (this.fields$[i].focus()) return;
        }

        rec?.focus();
    }


    public getValue(record:number, column:string) : any
    {
        if (this.data == null) return(null);
        return(this.data.getValue(+record,column));
    }


    public setValue(record:number, column:string, value:any) : boolean
    {
        if (this.data == null) return(false);

        if (+record >= +this.offset && +record < +this.offset+this.rows)
        {
            let field:Field = this.records[record-this.offset].getField(column);
            if (field != null) field.value = value;
        }

        let previous:any = this.data.getValue(+record,column);

        if (!this.data.update(+record,column,value))
            return(false);

        let trgevent:FieldTriggerEvent = new FieldTriggerEvent(column,null,+record,value,previous);
        this.invokeFieldTriggers(Trigger.PostChange,column,trgevent);
    }


    public getFieldValue(row:number, column:string)
    {
        if (row < 0 || row >= this.rows) return(null);
        return(this.records[+row].getField(column)?.value);
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

        if (this.records.length == 1)
        {
            record.current = true;
            this.field$ = record.fields[0].getFirstInstance();
        }
    }


    public set usage(usage:DatabaseUsage)
    {
        this.dbusage$ = usage;
    }


    public get usage() : DatabaseUsage
    {
        return(this.dbusage$);
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public dokey(name:string) : boolean
    {
        let key:string = KeyMapper.key(name);
        if (key == null) return(false);
        return(this.sendkey(null,key));
    }


    public sendkey(event:any,key:string) : boolean
    {
        this.onEvent(event,this.field,"key",key);
        return(true);
    }


    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        let errors:string[] = stmt.validate();

        if (errors.length > 0)
        {
            let msg:string = "<table>";
            errors.forEach((err) => {msg += "<tr><td>"+err+"</td></tr>"});
            msg += "</table>";

            this.alert(msg,"Execute");
            return(null);
        }

        let response:any = await this.app.appstate.connection.invokestmt(stmt);

        if (response["status"] == "failed")
            this.alert(JSON.stringify(response),"Execute SQL Failed");

        let rows:any[] = response["rows"];

        if (rows == null)
        {
            if (firstcolumn) return(null);
            return([]);
        }

        if (!firstrow) return(rows);

        let row:any = [];
        if (rows.length > 0) row = rows[0];

        if (!firstcolumn) return(row);

        let columns:string[] = Object.keys(row);
        if (columns.length == 0) return(null);

        return(row[columns[0]]);
    }


    public showListOfValues(field:string, id?:string, row?:number) : void
    {
        if (field == null)
            return;

        if (row == null || row == -1)
            row = this.row;

        if (!this.app.connected) return;
        if (!this.records[row].enabled) return;

        let ldef:LOVDefinition = null;
        field = field.trim().toLowerCase();

        if (this.idlovs != null && id != null && id.trim().length > 0)
        {
            id = id.trim().toLowerCase();
            ldef = this.idlovs.get(field+"."+id);
        }
        else if (this.lovs != null)
        {
            ldef = this.lovs.get(field);
        }

        if (ldef != null)
        {
            let lov:ListOfValues = null;
            let record:number = +row+this.offset;

            if (ldef.params.length == 0) lov = ldef.inst[ldef.func]();
            else                         lov = ldef.inst[ldef.func](record);

            let blocks:BlockImpl[] = [this,new BlockImpl(),new BlockImpl()];

            ListOfValuesImpl.show(this.app,blocks,lov);
        }
    }


    private async keyinsert(after:boolean) : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.usage.insert) return(false);

        if (this.data.database && !this.app.connected)
            return(false);

        return(await this.insert(after));
    }


    private async keydelete() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.usage.delete) return(false);

        if (this.data.database && !this.app.connected)
            return(false);

        return(await this.delete());
    }


    public async keyentqry() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.usage.query) return(false);

        if (this.data.database && !this.app.connected)
            return(false);

        return(await this.enterqry());
    }


    private async keyexeqry() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.usage.query) return(false);

        if (this.data.database && !this.app.connected)
            return(false);

        return(await this.executeqry());
    }


    public async enterqry() : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!await this.validate())
            return(false);

        this.clear();

        if (this.records.length > 0)
        {
            this.row = 0;

            this.state = FormState.entqry;
            this.records[0].state = RecordState.qmode;

            this.records[0].enable(false);
            this.focus();
        }

        return(true);
    }


    public async executeqry() : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!await this.validate())
            return(false);

        let keys:Key[] = [];
        let fields:Field[] = [];

        if (this.state == FormState.entqry)
        {
            fields = this.records[0].fields;
            this.records[0].disable();
        }

        this.state = FormState.exeqry;
        let stmt:Statement = this.data.parseQuery(keys,fields);

        let errors:string[] = stmt.validate();

        if (errors.length > 0)
        {
            let msg:string = "<table>";
            errors.forEach((err) => {msg += "<tr><td>"+err+"</td></tr>"});
            msg += "</table>";

            this.alert(msg,"Query Condition");
            return(false);
        }

        let event:SQLTriggerEvent = new SQLTriggerEvent(0,stmt);
        if (!await this.invokeTriggers(Trigger.PreQuery,event)) return(false);

        stmt = event.stmt; // could be replaced by trigger
        let response:any = await this.data.executequery(stmt);

        if (response["status"] == "failed")
        {
            this.clear();
            this.alert(JSON.stringify(response),"Database Query");
            return(false);
        }

        this.row = 0;
        this.display(0);
        this.state = FormState.normal;
        this.records[0].current = true;
        this.focus();

        return(true);
    }


    public async createControlRecord() : Promise<number>
    {
        if (!this.data.database)
        {
            if (await this.insert(true))
            {
                this.records[+this.row].state = RecordState.update;
                this.records[+this.row].enable(false);
                return(this.record);
            }
        }

        return(-1);
    }


    public async insert(after:boolean) : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!await this.validate())
            return(false);

        let off:number = after ? 1 : 0;

        if (!this.data.insert(+this.row + +this.offset + +off))
            return(false);

        // Is first row
        if (this.data.rows == 1)
        {
            this.display(this.offset);
            this.focus(0);
            return(true);
        }

        let scroll:number = 0;
        let row:number = this.row;

        if (after && this.row == this.rows - 1)
            scroll = 1;

        if (!after && this.row == 0)
            scroll = -1;

        let move:number = 0;
        if (scroll == 0) move = after ? 1 : 0;

        await this.display(+this.offset + scroll);

        row = +row + +move;
        let rec:Record = this.records[+row];

        rec.current = true;
        this.focus(row);

        return(true);
    }


    public async delete() : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!this.data.delete(+this.row + +this.offset))
            return(false);

        // current view is not full
        if (+this.data.rows - this.offset < this.rows)
        {
            this.offset--;
            if (this.offset < 0) this.offset = 0;
        }

        let row:number = this.row;
        await this.display(this.offset);

        // no records at current position
        if ((+row) + (+this.offset) >= this.data.rows)
            row = this.data.rows - this.offset - 1;

        if (row < 0) this.row = 0;

        this.focus(row);
    }


    private async lockrecord(record:number) : Promise<boolean>
    {
        if (this.data == null) return(true);
        if (this.data.locked(record)) return(true);

        let trgevent:TriggerEvent = new TriggerEvent(record,null);

        if (!await this.invokeTriggers(Trigger.Lock,trgevent))
            return(false);

        let response:any = await this.data.lock(record);

        if (response["status"] == "failed")
        {
            this.alert(JSON.stringify(response),"Lock Record");
            return(false);
        }

        this.app.appstate.transactionChange(true);
        return(true);
    }


    public async validate() : Promise<boolean>
    {
        if (this.data == null)
            return(true);

        if (this.data.database && !this.app.connected)
            return(true);

        if (this.records.length == 0)
            return(true);

        let rec:Record = this.records[this.row];
        if (!rec.enabled) return(true);

        if (!await this.validatefield(this.field,null))
            return(false);

        return(await this.validaterecord());
    }


    private async validatefield(field:FieldInstance, jsevent:any) : Promise<boolean>
    {
        if (field == null) return(true);
        if (this.data == null) return(true);
        if (this.state == FormState.entqry) return(true);

        let previous:any = this.getValue(+field.row+this.offset,field.name);

        if (previous == field.value) return(true);
        if (!this.field.field.validate()) return(false);

        if (!await this.lockrecord(+field.row+this.offset))
            return(false);

        this.data.update(+field.row+this.offset,field.name,field.value);

        let trgevent:FieldTriggerEvent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,previous,jsevent);

        if (!await this.invokeFieldTriggers(Trigger.WhenValidateField,field.name,trgevent))
            return(false);

        if (!await this.invokeTriggers(Trigger.WhenValidateField,trgevent))
            return(false);

        if (!await this.invokeFieldTriggers(Trigger.PostChange,field.name,trgevent))
            return(false);

        if (!await this.invokeTriggers(Trigger.PostChange,trgevent))
            return(false);

        return(true);
    }


    private async validaterecord() : Promise<boolean>
    {
        if (this.data == null) return(true);
        if (this.state == FormState.entqry) return(true);

        let rec:Record = this.records[this.row];
        if (rec.state == RecordState.na) return(true);

        if (!rec.validate()) return(false);
        if (this.data.validated(this.record)) return(true);

        let trgevent:TriggerEvent = new TriggerEvent(this.record,null);

        if (!await this.invokeTriggers(Trigger.WhenValidateRecord,trgevent))
            return(false);

        let response:any = await this.data.validate(this.record);

        if (response["status"] == "failed")
        {
            this.alert(JSON.stringify(response),"Validate Record");
            return(false);
        }

        rec.state = RecordState.update;
        rec.enable(false);

        return(true);
    }


    public async clear()
    {
        if (this.rows == null) return;
        this.records[0].current = true;

        for(let r = 0; r < this.rows; r++)
        {
            this.records[r].clear();
            this.records[r].disable();
        }

        this.details$.forEach((block) => {block.clear()});

        this.records[0].current = true;
        this.records[0].state = RecordState.na;
        this.records[0].enable(true);

        this.row = 0;
    }


    public async display(start:number) : Promise<void>
    {
        await this.clear();

        this.offset = start;
        if (this.data == null) return;

        if (+this.offset + +this.rows > +this.data.rows)
            this.offset = this.data.rows - this.rows;

        if (this.offset < 0) this.offset = 0;

        let columns:string[] = this.data.fields;
        let rows:any[][] = this.data.get(this.offset,this.rows);

        for(let r = 0; r < rows.length; r++)
        {
            let rec:Record = this.getRecord(r);
            let state:RecordState = this.data.state(+this.offset+r);

            for(let c = 0; c < rows[r].length; c++)
            {
                let field:Field = rec.getField(columns[c]);
                if (field != null) field.value = rows[r][c];
            }

            if (state == RecordState.na)
            {
                for(let c = 0; c < rows[r].length; c++)
                {
                    let field:Field = rec.getField(columns[c]);

                    let value:any = rows[r][c];
                    let fname:string = columns[c];
                    if (field != null) fname = field.name;

                    let trgevent:FieldTriggerEvent = new FieldTriggerEvent(fname,null,+r+this.offset,value,value);
                    this.invokeFieldTriggers(Trigger.PostChange,fname,trgevent);
                }

                this.invokeTriggers(Trigger.PostChange, new TriggerEvent(+r+this.offset));
                state = this.data.state(+this.offset+r,RecordState.update);
            }

            rec.state = state;
            rec.enable(false);
        }
    }


    public addTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        this.triggers.addTrigger(instance,func,types)
    }


    public addKeyTrigger(instance:any, func:TriggerFunction, keys:string|string[]) : void
    {
        this.triggers.addTrigger(instance,func,Trigger.Key,null,keys)
    }


    public addFieldTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[], fields:string|string[], keys?:string|string[]) : void
    {
        this.triggers.addTrigger(instance,func,types,fields,keys)
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string) : Promise<boolean>
    {
        let trgevent:TriggerEvent = null;
        if (event == null) event = {type: type};
        if (this.records.length == 0) return(true);

        if (type == "focus")
        {
            if (this.form != null)
                this.form.block = this;

            if (this.state == FormState.entqry)
                return(true);

            if (this.row != field.row)
            {
                if (!await this.validate())
                {
                    this.records[+this.row].current = true;
                    this.field.focus();
                    return(false);
                }
            }

            this.field$ = field;
            this.row = field.row;
            this.records$[+field.row].current = true;

            trgevent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,field.value,event);

            if (!await this.invokeFieldTriggers(Trigger.PreField,field.name,trgevent))
                return(false);

            return(await this.invokeTriggers(Trigger.PreField,trgevent));
        }

        if (type == "blur")
        {
            if (this.state == FormState.entqry)
                return(true);

            trgevent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,field.value,event);

            if (!await this.invokeFieldTriggers(Trigger.PostField,field.name,trgevent))
                return(false);

            return(await this.invokeTriggers(Trigger.PostField,trgevent));
        }

        if (type == "fchange")
        {
            if (this.state == FormState.entqry || this.data == null)
                return(true);

            return(await this.lockrecord(+field.row+this.offset));
        }

        if (type == "cchange")
        {
            if (this.state == FormState.entqry)
                return(true);

            let previous:any = this.getValue(+field.row+this.offset,field.name);
            trgevent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,previous,event);

            this.invokeTriggers(Trigger.Typing,trgevent);
            return(true);
        }

        if (type == "change")
        {
            // Current row field firing after move
            if (field.row != this.row) return(true);

            if (!await this.validatefield(field,event))
            {
                this.field.focus();
                return(false);
            }

            return(true);
        }

        // Cancel
        if (type == "key" && key == keymap.escape)
        {
            if (this.state == FormState.entqry)
            {
                this.records[0].current = true;

                this.records[0].clear();
                this.records[0].disable();
                this.state = FormState.normal;
                this.records[0].state = RecordState.na;
                this.records[0].enable(true);

                this.focus();
            }
        }

        // ListOfValues / Datepicker
        if (type == "key" && key == keymap.listval)
        {
            this.showListOfValues(field.name,field.id,this.row);
            return(true);
        }

        // Enter query
        if (type == "key" && key == keymap.enterquery)
        {
            if (this.state == FormState.entqry)
                return(true);

            if (!await this.keyentqry())
            {
                field.focus();
                return(false);
            }

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            return(true);
        }

        // Execute query
        if (type == "key" && key == keymap.executequery)
        {
            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            if (!await this.keyexeqry())
            {
                field.focus();
                return(false);
            }

            return(true);
        }

        // Delete
        if (type == "key" && key == keymap.delete)
        {
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            if (!await this.keydelete())
                return(false);

            return(true);
        }

        // Insert after
        if (type == "key" && key == keymap.insertafter)
        {
            if (!await this.validate()) return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            if (!await this.keyinsert(true))
            {
                field.focus();
                return(false);
            }

            return(true);
        }

        // Insert before
        if (type == "key" && key == keymap.insertbefore)
        {
            if (!await this.validate()) return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            if (!await this.keyinsert(false))
            {
                field.focus();
                return(false);
            }

            return(true);
        }

        // Next record
        if (type == "key" && key == keymap.nextrecord)
        {
            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            let row:number = +field.row + 1;
            if (this.data == null) return(false);

            if (+row >= +this.rows)
            {
                row = +this.rows - 1;
                if (this.data == null) return(false);

                let offset:number = +this.offset + +field.row;
                let fetched:number = await this.data.fetch(offset,1);

                if (fetched == 0) return(false);
                await this.display(this.offset+1);
            }

            this.focus(row);
            return(true);
        }

        // Previous record
        if (type == "key" && key == keymap.prevrecord)
        {
            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            let row:number = +field.row - 1;
            if (this.data == null) return(false);

            if (+row < 0)
            {
                row = 0;
                this.display(this.offset-1);
            }

            this.focus(row);
            return(true);
        }

        // Page down
        if (type == "key" && key == keymap.pagedown)
        {
            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            let offset:number = +this.offset + +field.row;
            let fetched:number = await this.data.fetch(offset,this.rows);

            if (fetched == 0) return(false);

            this.display(+this.offset+this.rows);
            this.focus();

            return(true);
        }

        // Page up
        if (type == "key" && key == keymap.pageup)
        {
            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            this.display(+this.offset-this.rows);
            this.focus();

            return(true);
        }

        if (type == "key" && key == keymap.prevfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == keymap.nextfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key")
        {
            trgevent = new KeyTriggerEvent(field,key,event);
            return(await this.invokeTriggers(Trigger.Key,trgevent,key));
        }

        if (type == "click")
        {
            trgevent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,field.value,event);
            return(await this.invokeTriggers(Trigger.MouseClick,trgevent,key));
        }

        if (type == "dblclick")
        {
            trgevent = new FieldTriggerEvent(field.name,field.id,+field.row+this.offset,field.value,field.value,event);
            return(await this.invokeTriggers(Trigger.MouseDoubleClick,trgevent,key));
        }

        return(true);
    }


    public async invokeTriggers(type:Trigger, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        if (!await this.triggers.invokeTriggers(type,event,key)) return(false);
        if (this.form != null) return(await this.form.invokeTriggers(type,event,key));
        return(true);
    }


    public async invokeFieldTriggers(type:Trigger, field:string, event:TriggerEvent, key?:string) : Promise<boolean>
    {
        if (!await this.triggers.invokeFieldTriggers(type,field,event,key)) return(false);
        if (this.form != null) return(await this.form.invokeFieldTriggers(type,field,event,key));
        return(true);
    }


    public sleep(ms:number) : Promise<void>
    {
        return(new Promise(resolve => setTimeout(resolve,ms)));
    }


    public alert(msg:string, title:string, width?:string, height?:string) : void
    {
        if (title == null) title = this.alias;
        MessageBox.show(this.app,msg,title,width,height);
    }
}