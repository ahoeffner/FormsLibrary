import { Key } from "./Key";
import { Block } from "./Block";
import { Field } from "../input/Field";
import { Utils } from "../utils/Utils";
import { FieldData } from "./FieldData";
import { keymap } from "../keymap/KeyMap";
import { FormImpl } from "../forms/FormImpl";
import { Record, RecordState } from "./Record";
import { FormState } from "../forms/FormState";
import { MessageBox } from "../popup/MessageBox";
import { MasterDetail } from "../forms/MasterDetail";
import { SQL, Statement } from "../database/Statement";
import { FieldInstance } from "../input/FieldInstance";
import { Trigger, Triggers } from "../events/Triggers";
import { ListOfValues } from "../listval/ListOfValues";
import { NameValuePair } from "../utils/NameValuePair";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { TriggerFunction } from "../events/TriggerFunction";
import { LOVDefinition } from "../annotations/LOVDefinitions";
import { ListOfValuesImpl } from "../listval/ListOfValuesImpl";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { ListOfValuesFunction } from "../listval/ListOfValuesFunction";
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
    private querying$:boolean = false;
    private disabled$:boolean = false;
    private navigable$:boolean = true;
    private masterdetail:MasterDetail;
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



    public get datarows() : number
    {
        if (this.data == null) return(0);
        return(this.data.rows);
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
        return(this.sum(this.row,this.offset));
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


    public setFields(fields:FieldInstance[])
    {
        this.fields$ = fields;
    }


    public setMasterDetail(md:MasterDetail) : void
    {
        this.masterdetail = md;
    }


    public setListOfValues(lovs:Map<string,LOVDefinition>) : void
    {
        this.lovs = lovs;
    }


    public setIdListOfValues(lovs:Map<string,LOVDefinition>) : void
    {
        this.idlovs = lovs;
    }


    public addListOfValues(form:boolean, func:ListOfValuesFunction, field:string, id?:string) : void
    {
        let utils:Utils = new Utils();

        let lovdef:LOVDefinition = null;
        let params:string[] = utils.getParams(func);

        if (!form) lovdef = {inst: this.block, func: func.name, params: params};
        else       lovdef = {inst: this.form.form, func: func.name, params: params};

        if (id == null) this.lovs.set(field.toLowerCase(),lovdef);
        else            this.idlovs.set(field.toLowerCase(),lovdef);
    }


    public removeListOfValues(field:string, id?:string) : void
    {
        if (id == null) this.lovs.delete(field.toLowerCase());
        else this.idlovs.delete(field.toLowerCase()+"."+id.toLowerCase());
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

        let rec:Record = this.records[+this.row];

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

        if (+record >= +this.offset && +record < this.sum(this.offset,this.rows))
        {
            let dbcol:string = column;
            let field:Field = this.records[record-this.offset].getField(column);

            if (field != null)
            {
                field.value = value;
                dbcol = field.definition.column;
            }

            let previous:any = this.data.getValue(+record,column);

            if (!this.data.setValue(+record,column,value))
                return(false);

            this.data.setValidated(record,column);

            let trgevent:FieldTriggerEvent = new FieldTriggerEvent(this.alias,column,null,+record,value,previous);
            this.invokeFieldTriggers(Trigger.PostChange,column,trgevent);

            if (record == this.record && this.masterdetail != null && value != previous)
                this.masterdetail.sync(this,record,dbcol);
        }
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


    public sendkey(event:any,key:keymap) : boolean
    {
        this.onEvent(event,this.field,"key",key);
        return(true);
    }


    public get searchfilter() : NameValuePair[]
    {
        if (this.data == null) return(null);
        return(this.data.searchfilter);
    }


    public set searchfilter(filter:NameValuePair[])
    {
        if (this.data != null)
            this.data.searchfilter = filter;
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
        if (!this.records[+row].enabled) return;
        if (this.records[+row].state == RecordState.na) return;

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
            let record:number = this.sum(row,this.offset);

            if (ldef.params.length == 0) lov = ldef.inst[ldef.func]();
            else                         lov = ldef.inst[ldef.func](record);

            let blocks:BlockImpl[] = [this,new BlockImpl(),new BlockImpl()];

            if (!lov.force && this.records[+row].getField(field)?.readonly)
                return;

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


    public async keyentqry(force?:boolean) : Promise<boolean>
    {
        if (force == null) force = false;

        if (!force)
        {
            if (this.data == null) return(false);
            if (!this.usage.query) return(false);

            if (this.data.database && !this.app.connected)
                return(false);
        }

        if (!await this.enterqry())
            return(false);

        if (this.masterdetail != null)
            this.masterdetail.enterquery(this);

        this.focus(0);
        return(true);
    }


    public async keyexeqry(force?:boolean) : Promise<boolean>
    {
        if (this.masterdetail != null)
        {
            if (this.masterdetail.master != null && this.masterdetail.master != this)
                return(this.masterdetail.master.keyexeqry(force));

            if (this.state != FormState.entqry)
                this.masterdetail.clearfilters(this);
        }

        if (force == null) force = false;

        if (!force)
        {
            if (this.data == null || !this.usage.query)
            {
                if (this.masterdetail != null)
                    this.masterdetail.master = null;

                return(false);
            }

            if (this.data.database && !this.app.connected)
            {
                if (this.masterdetail != null)
                    this.masterdetail.master = null;

                return(false);
            }
        }

        let subquery:SQL = null;

        if (this.masterdetail != null)
            subquery = this.masterdetail.getDetailQuery();

        let status = await this.executeqry(subquery);
        this.focus(0);

        return(status);
    }


    public cancelqry() : void
    {
        this.records[0].current = true;

        this.records[0].clear();
        this.records[0].disable();

        this.state = FormState.normal;
        this.records[0].state = RecordState.na;

        this.records[0].enable(true);
    }


    public async enterqry() : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!await this.validate())
            return(false);

        await this.clear();

        this.row = 0;

        this.searchfilter = [];
        this.state = FormState.entqry;
        this.records[0].state = RecordState.qmode;

        this.records[0].enable(false);
        return(true);
    }


    public async executeqry(subquery?:SQL) : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!await this.validate())
            return(false);

        let keys:Key[] = [];
        let fields:Field[] = [];

        if (this.querying$)
            return(false);

        this.querying$ = true;

        if (this.state == FormState.entqry)
        {
            fields = this.records[0].fields;
            this.records[0].disable();
        }

        if (this.masterdetail != null)
            keys = this.masterdetail.getKeys(this);

        this.state = FormState.exeqry;
        let stmt:Statement = this.data.parseQuery(keys,subquery,fields);

        let errors:string[] = stmt.validate();

        if (errors.length > 0)
        {
            let msg:string = "<table>";
            errors.forEach((err) => {msg += "<tr><td>"+err+"</td></tr>"});
            msg += "</table>";

            this.alert(msg,"Query Condition");

            this.querying$ = false;

            if (this.masterdetail != null)
                this.masterdetail.done();

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

            this.querying$ = false;

            if (this.masterdetail != null)
                this.masterdetail.done();

            return(false);
        }

        if (this.masterdetail != null)
            this.masterdetail.querydetails(this);

        this.row = 0;
        await this.display(0);

        this.querying$ = false;
        this.state = FormState.normal;
        this.records[0].current = true;

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

        if (!this.data.insert(this.sum(this.row,this.offset,off)))
            return(false);

        if (this.masterdetail != null)
            this.masterdetail.cleardetails(this);

        // Is first row
        if (this.data.rows == 1)
        {

            await this.display(this.offset);

            if (this.form == null) this.disableall();
            else                   this.form.disableall();

            this.records[0].enable(false);

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

        await this.display(this.sum(this.offset,scroll));

        row = this.sum(row,move);
        let rec:Record = this.records[+row];

        rec.current = true;

        if (this.form == null) this.disableall();
        else                   this.form.disableall();

        this.records[+row].enable(false);

        this.focus(row);
        return(true);
    }


    public async delete() : Promise<boolean>
    {
        if (this.data.database && !this.app.connected)
            return(false);

        if (!this.data.delete(this.sum(this.row,this.offset)))
            return(false);

        if (this.masterdetail != null)
            this.masterdetail.cleardetails(this);

        // current view is not full
        if (+this.data.rows - this.offset < this.rows)
        {
            this.offset--;
            if (this.offset < 0) this.offset = 0;
        }

        let row:number = this.row;
        await this.display(this.offset);

        // no records at current position
        if (this.sum(row,this.offset) >= this.data.rows)
            row = this.data.rows - this.offset - 1;

        if (row < 0) this.row = 0;

        this.focus(row);

        if (this.masterdetail != null)
            this.masterdetail.querydetails(this,this.record);
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
        if (!await this.validatefield(this.field))
            return(false);

        return(await this.validaterecord());
    }


    private async validatefield(field:FieldInstance) : Promise<boolean>
    {
        if (field == null) return(true);
        if (this.data == null) return(true);
        if (this.row >= this.data.rows) return(true);
        if (this.state == FormState.entqry) return(true);
        if (this.records[+this.row].state == RecordState.na) return(true);

        if (!field.validate())
        {
            field.valid = false;
            this.data.setValue(this.sum(field.row,this.offset),field.name,field.value);
            return(false);
        }

        let previous:any = this.data.getValue(this.sum(field.row,this.offset),field.name)

        // Nothing has changed
        if (field.value == previous) return(this.data.getValidated(this.sum(field.row,this.offset),field.name));

        this.data.setValue(+field.row+this.offset,field.name,field.value);

        let trgevent:FieldTriggerEvent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,previous,null);
        if (!await this.invokeFieldTriggers(Trigger.WhenValidateField,field.name,trgevent))
        {
            field.valid = false;
            return(false);
        }

        field.parent.valid = true;
        this.data.setValidated(this.sum(field.row,this.offset),field.name);

        if (!await this.lockrecord(this.sum(field.row,this.offset)))
            return(false);

        if  (field.value != previous)
        {
            if (this.sum(field.row,this.offset) == this.record && this.masterdetail != null)
                this.masterdetail.sync(this,this.record,field.definition.column);

            if (!await this.invokeFieldTriggers(Trigger.PostChange,field.name,trgevent))
                return(false);

                if (this.records[+this.row].state == RecordState.insert)
                {
                    if (this.data.validated(this.record,true))
                        this.validaterecord();
                }
            }

        return(true);
    }


    private async validaterecord() : Promise<boolean>
    {
        if (this.data == null) return(true);
        if (this.row >= this.data.rows) return(true);
        if (this.state == FormState.entqry) return(true);
        if (this.records[+this.row].state == RecordState.na) return(true);

        let rec:Record = this.records[+this.row];
        if (rec.state == RecordState.na) return(true);

        // Check fields is validated
        if (!this.data.validated(this.record,true))
        {
            let cols:string[] = this.data.getNonValidated(this.record);
            this.alert("The following columns are not valid:<br><br>"+cols,"Validate Record");

            cols.forEach((col) =>
            {this.records[+this.record].getField(col).valid = false;});

            return(false);
        }

        // Check record is validated
        if (this.data.validated(this.record,false)) return(true);

        let trgevent:TriggerEvent = new TriggerEvent(this.record,null);

        if (!await this.invokeTriggers(Trigger.WhenValidateRecord,trgevent))
            return(false);

        this.data.setValidated(this.record);
        if (rec.state == RecordState.insert)
        {
            rec.state = RecordState.update;

            if (this.form == null) this.enableall();
            else                   this.form.enableall();
        }

        return(true);
    }


    public async clearblock()
    {
        this.clear();
        this.searchfilter = [];
    }


    public async clear()
    {
        if (this.rows == null) return;
        this.records[0].current = true;

        for(let r = 0; r < this.rows; r++)
        {
            this.records[+r].clear();
            this.records[+r].disable();
            this.records[+r].state = RecordState.na;
        }

        this.records[0].current = true;
        this.records[0].state = RecordState.na;
        if (!this.disabled$) this.records[0].enable(true);
    }


    public async disableall()
    {
        this.disabled$ = true;
        for(let r = 0; r < this.rows; r++)
            this.records[+r].disable();
    }


    public async enableall()
    {
        this.disabled$ = false;
        for(let r = 0; r < this.rows; r++)
        {
            if (this.records[+r].state != RecordState.na)
                this.records[+r].enable(false);
        }
    }


    public async display(start:number) : Promise<void>
    {
        await this.clear();

        this.offset = start;
        if (this.data == null) return;

        if (this.sum(this.offset,this.rows) > +this.data.rows)
            this.offset = this.data.rows - this.rows;

        if (this.offset < 0) this.offset = 0;

        let columns:string[] = this.data.fields;
        let rows:any[][] = this.data.get(this.offset,this.rows);

        for(let r = 0; r < rows.length; r++)
        {
            let rec:Record = this.getRecord(r);
            let state:RecordState = this.data.state(this.sum(this.offset,r));

            for(let c = 0; c < rows[r].length; c++)
            {
                let field:Field = rec.getField(columns[c]);
                if (field != null) field.value = rows[r][c];
            }

            if (state == RecordState.na)
            {
                let execs:Promise<boolean>[] = [];

                for(let c = 0; c < rows[r].length; c++)
                {
                    let field:Field = rec.getField(columns[c]);

                    let value:any = rows[r][c];
                    let fname:string = columns[c];
                    if (field != null) fname = field.name;

                    let trgevent:FieldTriggerEvent = new FieldTriggerEvent(this.alias,fname,null,this.sum(r,this.offset),value,value);
                    execs.push(this.invokeFieldTriggers(Trigger.PostChange,fname,trgevent));
                }

                execs.push(this.invokeTriggers(Trigger.PostChange, new TriggerEvent(this.sum(r,this.offset))));
                state = this.data.state(this.sum(this.offset,r),RecordState.update);

                for (let i = 0; i < execs.length; i++) await execs[i];
            }

            rec.state = state;
            if (!this.disabled$) rec.enable(false);
        }
    }


    public addTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[]) : void
    {
        this.triggers.addTrigger(instance,func,types)
    }


    public addKeyTrigger(instance:any, func:TriggerFunction, keys:keymap|keymap[]) : void
    {
        this.triggers.addTrigger(instance,func,Trigger.Key,null,keys)
    }


    public addFieldTrigger(instance:any, func:TriggerFunction, types:Trigger|Trigger[], fields:string|string[], keys?:keymap|keymap[]) : void
    {
        this.triggers.addTrigger(instance,func,types,fields,keys)
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:keymap) : Promise<boolean>
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

                if (this.masterdetail != null)
                    this.masterdetail.querydetails(this,this.sum(field.row,this.offset),true);
            }

            this.field$ = field;
            this.row = field.row;
            this.records$[+field.row].current = true;

            trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,field.value,event);
            return(await this.invokeFieldTriggers(Trigger.PreField,field.name,trgevent));
        }

        if (type == "blur")
        {
            if (this.state == FormState.entqry)
                return(true);

            trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,field.value,event);
            return(await this.invokeFieldTriggers(Trigger.PostField,field.name,trgevent));
        }

        if (type == "fchange")
        {
            if (this.state == FormState.entqry || this.data == null)
                return(true);

            return(await this.lockrecord(this.sum(field.row,this.offset)));
        }

        if (type == "cchange")
        {
            if (this.state == FormState.entqry)
                return(true);

            let previous:any = this.getValue(this.sum(field.row,this.offset),field.name);
            trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,previous,event);

            return(this.invokeFieldTriggers(Trigger.Typing,field.name,trgevent));
        }

        if (type == "change")
        {
            // Current row field firing after move
            if (field.row != this.row) return(true);

            // This will fire appropiate triggers
            if (!await this.validatefield(field))
            {
                this.field.focus();
                return(false);
            }

            return(true);
        }

        // Enter
        if (type == "key" && key == keymap.enter)
        {
            if (this.state == FormState.entqry)
                key = keymap.executequery;

            if (this.records[+this.row]?.state == RecordState.insert)
            {
                if (!await this.validaterecord())
                    return(false);
            }

            if (this.records[+this.row]?.state == RecordState.update)
            {
                if (!await this.validaterecord())
                    return(false);
            }
        }

        // Cancel
        if (type == "key" && key == keymap.escape)
        {
            if (this.state == FormState.entqry)
            {
                this.cancelqry();
                this.focus();
            }

            if (this.records[+this.row]?.state == RecordState.insert)
            {
                this.enableall();
                key = keymap.delete;
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
            if (!await this.validate()) return(false);

            if (!await this.keyentqry())
            {
                field.focus();
                return(false);
            }

            trgevent = new KeyTriggerEvent(field,key,event);

            return(await this.invokeTriggers(Trigger.Key,trgevent,key));
        }

        // Execute query
        if (type == "key" && key == keymap.executequery)
        {
            if (!await this.validate()) return(false);
            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            return(await this.keyexeqry());
        }

        // Delete
        if (type == "key" && key == keymap.delete)
        {
            trgevent = new KeyTriggerEvent(field,key,event);

            if (this.records[+this.row]?.state == RecordState.update)
            {
                if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                    return(false);
            }

            return(await this.keydelete());
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

        // Next/Previous field
        if (type == "key" && (key == keymap.nextfield || key == keymap.prevfield))
        {
            if (this.state != FormState.entqry && this.records[+this.row]?.state != RecordState.na)
            {
                let previous:any = this.data.getValue(this.sum(field.row,this.offset),field.name)

                if (field.dirty)
                {
                    // ctrl-z doesn't refresh
                    if (field.value == previous) field.parent.copy(field);
                }

                trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,previous,event);

                if (key == keymap.prevfield)
                {
                    if (!await this.invokeFieldTriggers(Trigger.KeyPrevField,field.name,trgevent,key))
                        return(false);
                }

                if (key == keymap.nextfield)
                {
                    if (!await this.invokeFieldTriggers(Trigger.KeyNextField,field.name,trgevent,key))
                        return(false);
                }
            }
        }

        // Next record
        if (type == "key" && key == keymap.nextrecord)
        {
            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            let row:number = this.sum(field.row,1);
            if (this.data == null) return(false);

            if (+row >= +this.rows)
            {
                row = +this.rows - 1;
                if (this.data == null) return(false);

                let offset:number = this.sum(field.row,this.offset);
                let fetched:number = await this.data.fetch(offset,1);

                if (fetched == 0) return(false);
                await this.display(this.sum(this.offset,1));
            }

            this.focus(row);

            if (this.masterdetail != null)
                this.masterdetail.querydetails(this,this.record,true);

            return(true);
        }

        // Previous record
        if (type == "key" && key == keymap.prevrecord)
        {
            if (this.record == 0)
                return(true);

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
                await this.display(this.offset - 1);
            }

            this.focus(row);

            if (this.masterdetail != null)
                this.masterdetail.querydetails(this,this.record,true);

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

            let offset:number = this.sum(this.offset,field.row);
            let fetched:number = await this.data.fetch(offset,this.rows);

            if (fetched == 0) return(false);

            await this.display(this.sum(this.offset,this.rows));
            this.focus();

            if (this.masterdetail != null)
                this.masterdetail.querydetails(this,this.record,true);

            return(true);
        }

        // Page up
        if (type == "key" && key == keymap.pageup)
        {
            if (this.record == 0)
                return(true);

            if (!await this.validate())
                return(false);

            trgevent = new KeyTriggerEvent(field,key,event);

            if (!await this.invokeTriggers(Trigger.Key,trgevent,key))
                return(true);

            await this.display(+this.offset-this.rows);
            this.focus();

            if (this.masterdetail != null)
                this.masterdetail.querydetails(this,this.record,true);

            return(true);
        }

        // Next/Prev block
        if (type == "key" && (key == keymap.prevblock || key == keymap.nextblock))
        {
            if (this.state != FormState.entqry && this.records[+this.row]?.state != RecordState.na)
            {
                if (!await this.validate())
                    return(false);

                trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,null,event);

                if (key == keymap.prevblock)
                {
                    if (!await this.invokeFieldTriggers(Trigger.KeyPrevBlock,field.name,trgevent,key))
                        return(false);
                }

                if (key == keymap.nextblock)
                {
                    if (!await this.invokeFieldTriggers(Trigger.KeyNextBlock,field.name,trgevent,key))
                        return(false);
                }
            }
        }

        if (type == "key" && key == keymap.prevfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == keymap.nextfield && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == keymap.prevblock && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key" && key == keymap.nextblock && this.form != null)
            await this.form.onEvent(event,field,type,key);

        if (type == "key")
        {
            trgevent = new KeyTriggerEvent(field,key,event);
            return(await this.invokeTriggers(Trigger.Key,trgevent,key));
        }

        if (type == "click")
        {
            trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,field.value,event);
            return(await this.invokeFieldTriggers(Trigger.MouseClick,field.name,trgevent,key));
        }

        if (type == "dblclick")
        {
            trgevent = new FieldTriggerEvent(this.alias,field.name,field.id,this.sum(field.row,this.offset),field.value,field.value,event);
            return(await this.invokeFieldTriggers(Trigger.MouseDoubleClick,field.name,trgevent,key));
        }

        return(true);
    }


    public async invokeTriggers(type:Trigger, event:TriggerEvent, key?:keymap) : Promise<boolean>
    {
        if (!await this.triggers.invokeTriggers(type,event,key)) return(false);
        if (this.form != null) return(await this.form.invokeTriggers(type,event,key));
        return(true);
    }


    public async invokeFieldTriggers(type:Trigger, field:string, event:TriggerEvent, key?:keymap) : Promise<boolean>
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


    private sum(n1:number,n2:number, n3?:number) : number
    {
        let s:number = +n1 + +n2;
        if (n3 != null) s = +s + +n3;
        return(s);
    }
}