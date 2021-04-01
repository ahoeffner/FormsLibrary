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
import { DatabaseUsage } from "../database/DatabaseUsage";
import { FieldDefinition } from "../input/FieldDefinition";
import { TriggerFunction } from "../events/TriggerFunction";
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
    private dbusage$:DatabaseUsage;
    private records$:Record[] = [];
    private details$:BlockImpl[] = [];
    private triggers:Triggers = new Triggers();
    private state:FormState = FormState.normal;
    private fieldef$:Map<string,FieldDefinition>;


    constructor(public block:Block)
    {
        this.dbusage$ =
        {
            query: true,
            insert: true,
            update: true,
            delete: true
        };

        this.name$ = block.constructor.name;
        if (this.name$ == "Block") this.name$ = "anonymous";
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


    public get field() : FieldInstance
    {
        return(this.field$);
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


    public set form(form:FormImpl)
    {
        this.form$ = form;
    }


    public get form() : FormImpl
    {
        return(this.form$);
    }


    public get querymode() : boolean
    {
        return(this.state == FormState.entqry);
    }


    public set fielddef(fielddef:Map<string,FieldDefinition>)
    {
        this.fieldef$ = fielddef;
    }


    public get fielddef() : Map<string,FieldDefinition>
    {
        return(this.fieldef$);
    }


    public focus(row?:number) : void
    {
        if (row != null && row >= 0 && row < this.rows)
        {
            this.row = row;
            this.records[row].current = true;
        }

        let rec:Record = this.records[this.row];

        if (this.field != null)
        {
            let field:FieldInstance = rec?.getFieldByGuid(this.field.name,this.field.guid);

            if (field?.focus()) return;
            if (this.field?.focus()) return;
        }

        rec?.focus();
    }


    public getValue(column:string, row:number) : any
    {
        if (this.data == null) return(null);
        return(this.data.getValue(+row+this.offset,column));
    }


    public setValue(column:string, row:number, value:any) : boolean
    {
        if (this.data == null) return(false);
        if (row < 0 || row >= this.rows) return(false);

        let field:Field = this.records[row].getField(column);
        if (field != null) field.value = value;

        return(this.data.update(+row+this.offset,column,value));
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


    public setDatabaseUsage(usage:DatabaseUsage) : void
    {
        this.dbusage$ = usage;
    }


    public get dbusage() : DatabaseUsage
    {
        return(this.dbusage$);
    }


    public setApplication(app:ApplicationImpl) : void
    {
        this.app = app;
    }


    public dokey(name:string) : void
    {
        let key:string = KeyMapper.key(name);
        this.sendkey(null,key);
    }


    public sendkey(event:any,key:string) : void
    {
        this.onEvent(event,this.field,"key",key);
    }


    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
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


    private async keyinsert(after:boolean) : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.dbusage.insert) return(false);
        if (!await this.validate()) return(false);
        return(this.insert(after));
    }


    private async keydelete() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.dbusage.delete) return(false);
        return(this.delete());
    }


    private async keyentqry() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.dbusage.query) return(false);
        if (!await this.validate()) return(false);
        return(this.enterqry());
    }


    private async keyexeqry() : Promise<boolean>
    {
        if (this.data == null) return(false);
        if (!this.dbusage.query) return(false);
        if (!await this.validate()) return(false);
        return(this.executeqry());
    }


    public enterqry() : boolean
    {
        if (this.data.database && !this.app.appstate.connected)
            return(false);

        this.clear();

        if (this.records.length > 0)
        {
            this.row = 0;
            this.state = FormState.entqry;
            this.records[0].enable(RecordState.qmode,false);
            this.focus();
        }

        return(true);
    }


    public async executeqry() : Promise<boolean>
    {
        if (this.data.database && !this.app.appstate.connected)
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
        let event:SQLTriggerEvent = new SQLTriggerEvent(0,stmt);
        if (!await this.invokeTriggers(Trigger.PreQuery,event)) return(false);

        let response:any = await this.data.executequery(stmt);

        if (response["status"] == "failed")
        {
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


    public insert(after:boolean) : boolean
    {
        if (this.data.database && !this.app.appstate.connected)
            return(false);

        let off:number = after ? 1 : 0;

        if (!this.data.insert(+this.row + +this.offset + +off))
            return(false);

        // Is first row
        if (this.data.rows == 1)
        {
            this.display(this.offset);
            this.focus();
            return;
        }

        let scroll:number = 0;

        if (after && this.row == this.rows - 1)
            scroll = 1;

        if (!after && this.row == 0)
            scroll = -1;

        let move:number = 0;
        if (scroll == 0) move = after ? 1 : 0;

        let row:number = this.row;
        this.display(+this.offset + scroll);
        this.row = row;

        this.row = +this.row + +move;
        let rec:Record = this.records[+this.row];

        rec.current = true;
        this.focus();
    }


    public delete() : boolean
    {
        if (this.data.database && !this.app.appstate.connected)
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
        this.display(this.offset);
        this.row = row;

        // no records at current position
        if ((+this.row) + (+this.offset) >= this.data.rows)
            this.row = this.data.rows - this.offset - 1;

        if (this.row < 0) this.row = 0;
        this.focus();
    }


    private setDataValue(row:number, col:string, value:any) : boolean
    {
        if (this.data == null) return(false);
        return(this.data.update(+row+this.offset,col,value));
    }


    public async validate() : Promise<boolean>
    {
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
        if (this.state == FormState.entqry) return(true);

        let previous:any = this.getValue(field.name,field.row);
        if (previous == field.value) return(true);

        this.setDataValue(field.row,field.name,field.value);
        let trgevent:FieldTriggerEvent = new FieldTriggerEvent(field.name,field.row,field.value,previous,jsevent);

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
        if (this.data.validated(+this.row + +this.offset)) return(true);

        let trgevent:TriggerEvent = new TriggerEvent(this.row,null);

        if (!await this.invokeTriggers(Trigger.WhenValidateRecord,trgevent))
            return(false);

        this.data.validate(+this.row + +this.offset);
        return(true);
    }


    public async clear()
    {
        if (this.rows == null) return;

        for(let r = 0; r < this.rows; r++)
        {
            this.records[r].clear();
            this.records[r].disable();
        }

        this.details$.forEach((block) => {block.clear()});

        this.records[0].current = true;
        this.records[0].enable(RecordState.na,true);

        this.row = 0;
        this.focus();
    }


    public async display(start:number) : Promise<void>
    {
        this.clear();
        this.offset = start;
        if (this.data == null) return;

        if (+this.offset + +this.rows > +this.data.rows)
            this.offset = this.data.rows - this.rows;

        if (this.offset < 0) this.offset = 0;

        let columns:string[] = this.data.fields;
        let rows:any[][] = this.data.get(this.offset,this.rows);

        if (rows.length == 0)
        {
            this.focus();
            return;
        }

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

                    if (field != null)
                    {
                        let trgevent:FieldTriggerEvent = new FieldTriggerEvent(field.name,+r,field.value,field.value);
                        this.invokeFieldTriggers(Trigger.PostChange,field.name,trgevent);
                    }
                }

                this.invokeTriggers(Trigger.PostChange, new TriggerEvent(+r));
                state = this.data.state(+this.offset+r,RecordState.update);
            }

            rec.enable(state,false);
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
        let delay:number = 10;
        let trgevent:TriggerEvent = null;
        if (event == null) event = {type: type};
        if (this.records.length == 0) return(true);
        if (this.data != null && this.data.database && !this.app.appstate.connected) return(true);

        if (type == "focus")
        {
            if (this.form != null)
                this.form.block = this;

            if (this.state == FormState.entqry)
                return(true);

            if (this.row != field.row)
            {
                if (!await this.validaterecord())
                {
                    this.records[+this.row].current = true;
                    this.field.focus();
                    return(false);
                }
            }

            this.field$ = field;
            this.row = field.row;
            this.records$[+field.row].current = true;

            trgevent = new FieldTriggerEvent(field.name,field.row,field.value,field.value,event);

            if (!await this.invokeFieldTriggers(Trigger.PreField,field.name,trgevent))
                return(false);

            return(await this.invokeTriggers(Trigger.PreField,trgevent));
        }

        if (type == "blur")
        {
            if (this.state == FormState.entqry)
                return(true);

            trgevent = new FieldTriggerEvent(field.name,field.row,field.value,field.value,event);

            if (!await this.invokeFieldTriggers(Trigger.PostField,field.name,trgevent))
                return(false);

            return(await this.invokeTriggers(Trigger.PostField,trgevent));
        }

        if (type == "fchange")
        {
            if (this.state == FormState.entqry || this.data == null)
                return(true);

            if (this.data.locked(+field.row+this.offset))
                return(false);

            let previous:any = this.getValue(field.name,field.row);
            trgevent = new FieldTriggerEvent(field.name,field.row,field.value,previous,event);

            if (!await this.invokeTriggers(Trigger.Lock,trgevent))
                return(false);

            let response:any = await this.data.lock(+field.row+this.offset);

            if (response["status"] == "failed")
            {
                this.alert(JSON.stringify(response),"Lock Record");
                return(false);
            }

            return(true);
        }

        if (type == "ichange")
        {
            if (this.state == FormState.entqry)
                return(true);

            let previous:any = this.getValue(field.name,field.row);
            trgevent = new FieldTriggerEvent(field.name,field.row,field.value,previous,event);

            this.invokeTriggers(Trigger.Typing,trgevent);
        }

        if (type == "change")
        {
            await this.validatefield(field,event);
            return(true);
        }

        // Cancel
        if (type == "key" && key == keymap.escape)
        {
            if (this.state == FormState.entqry)
            {
                field.blur();
                await this.sleep(delay);

                this.records[0].disable();
                this.records[0].clear(true);
                this.state = FormState.normal;
                this.records[0].enable(RecordState.na,true);

                this.focus();
            }
        }

        // Enter query
        if (type == "key" && key == keymap.enterquery)
        {
            if (this.state == FormState.entqry)
                return(true);

            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            field.blur();
            await this.sleep(delay);

            return(await this.keyentqry());
        }

        // Execute query
        if (type == "key" && key == keymap.executequery)
        {
            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            field.blur();
            await this.sleep(delay);

            return(await this.keyexeqry());
        }

        // Delete
        if (type == "key" && key == keymap.delete)
        {
            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            field.blur();
            await this.sleep(delay);

            return(await this.keydelete());
        }

        // Insert after
        if (type == "key" && key == keymap.insertafter)
        {
            if (!await this.validate()) return(false);
            this.setDataValue(field.row,field.name,field.value);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            field.blur();
            await this.sleep(delay);

            return(await this.keyinsert(true));
        }

        // Insert before
        if (type == "key" && key == keymap.insertbefore)
        {
            if (!await this.validate()) return(false);
            this.setDataValue(field.row,field.name,field.value);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            field.blur();
            await this.sleep(delay);

            return(await this.keyinsert(false));
        }

        // Next record
        if (type == "key" && key == keymap.nextrecord)
        {
            if (!await this.validate())
                return(false);

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

                field.blur();
                await this.sleep(delay);

                this.display(this.offset+1);
            }
            else
            {
                if (field.current && !await this.onEvent(null,this.field,"change"))
                    return(false);
            }

            this.focus(row);
        }

        // Previous record
        if (type == "key" && key == keymap.prevrecord)
        {
            if (!await this.validate())
                return(false);

            let row:number = +field.row - 1;
            if (this.data == null) return(false);

            if (+row < 0)
            {
                row = 0;

                if (!await this.onEvent(null,this.field,"change"))
                    return(false);


                field.blur();
                await this.sleep(delay);

                this.display(this.offset-1);
            }
            else
            {
                if (field.current)
                if (!await this.onEvent(null,this.field,"change")) return(false);
            }

            this.focus(row);
        }

        // Page down
        if (type == "key" && key == keymap.pagedown)
        {
            if (!await this.validate())
                return(false);

            let offset:number = +this.offset + +field.row;
            let fetched:number = await this.data.fetch(offset,this.rows);

            if (fetched == 0) return(false);
            if (!await this.onEvent(null,this.field,"change")) return(false);

            field.blur();
            await this.sleep(delay);

            this.display(+this.offset+this.rows);
            this.focus();

            return(true);
        }

        // Page up
        if (type == "key" && key == keymap.pageup)
        {
            if (!await this.validate())
                return(false);

            field.blur();
            await this.sleep(delay);

            this.display(+this.offset-this.rows);
            this.focus();

            return(true);
        }

        event["navigate"] = true;

        if (type == "key" && key == keymap.prevfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == keymap.nextfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        event["navigate"] = false;

        // Pass event to subscribers, stop if signalled
        if (type == "key")
        {
            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (key != null && !await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);
        }

        // Pass event on to parent (form)
        if (this.form != null)
            this.form.onEvent(event,field,type,key);

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


    public alert(msg:string, title:string) : void
    {
        MessageBox.show(this.app,msg,title);
    }
}