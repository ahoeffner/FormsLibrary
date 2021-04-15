import { Key } from "./Key";
import { RecordState } from "./Record";
import { Field } from "../input/Field";
import { BlockImpl } from "./BlockImpl";
import { Table } from "../database/Table";
import { Statement } from "../database/Statement";
import { FieldDefinition } from "../input/FieldDefinition";


export class FieldData
{
    private table:Table;
    private scn:number = 0;
    private query:Statement;
    private block:BlockImpl;
    private data:Row[] = [];
    private fields$:string[];
    private fielddef:Map<string,FieldDefinition>;
    private index:Map<string,number> = new Map<string,number>();


    public constructor(block:BlockImpl, table:Table, fields:string[], fielddef:Map<string,FieldDefinition>)
    {
        this.block = block;
        this.table = table;
        this.fields$ = fields;
        this.fielddef = fielddef;

        if (table != null)
            this.table.fielddata = this;

        if (fields != null)
        {
            for(let i = 0; i < fields.length; i++)
                this.index.set(fields[i].toLowerCase(),i);
        }
    }


    public get database() : boolean
    {
        return(this.table != null);
    }


    public get fields() : string[]
    {
        return(this.fields$);
    }


    public set fields(fields:string[])
    {
        this.index.clear();
        this.fields$ = fields;

        for(let i = 0; i < fields.length; i++)
            this.index.set(fields[i].toLowerCase(),i);
    }


    public get columns() : string[]
    {
        if (this.table == null) return(null);
        else return(this.table.columns);
    }


    public get fetched() : number
    {
        return(this.data.length);
    }


    public async lock(record:number) : Promise<any>
    {
        if (record < 0 || record >= this.data.length)
            return({status: "failed", message: "row "+record+" does not exist"});

        if (this.data[record].locked)
            return({status: "failed", message: "row "+record+" already locked"});

        if (this.table == null)
            return({status: "ok"});

        this.data[record].locked = true;
        return({status: "ok"});
    }


    public locked(record:number) : boolean
    {
        if (record < 0 || record >= this.data.length) return(false);
        return(this.data[+record].locked);
    }


    public mandatory(column:string) : boolean
    {
        let md:boolean = false;

        if (this.table != null)
            md = this.table.mandatory(column);

        if (!md)
        {
            md = this.fielddef.get(column)?.mandatory;
            if (md == null) md = false;
        }

        return(md);
    }


    public getNonValidated(record:number) : string[]
    {
        if (record < 0 || record >= this.data.length) return([]);

        let row:Row = this.data[record];

        let cols:string[] = [];

        for (let i = 0; i < row.fields.length; i++)
        {
            if (this.mandatory(this.fields[i]) && row.fields[i].value$ == null)
            {
                cols.push(this.columns[i]);
            }
            else if (!row.fields[i].validated)
            {
                cols.push(this.columns[i]);
            }
        }

        return(cols);
    }


    public validated(record:number, fields:boolean) : boolean
    {
        if (record < 0 || record >= this.data.length) return(true);

        let row:Row = this.data[record];

        if (fields)
        {
            for (let i = 0; i < row.fields.length; i++)
            {
                if (this.mandatory(this.fields[i]) && row.fields[i].value$ == null)
                    return(false);

                if (!row.fields[i].validated) return(false);
            }
            return(true);
        }

        return(row.validated);
    }

    public newrow() : Row
    {
        let row:Row = new Row(++this.scn,this);
        return(row);
    }


    public add(row:Row)
    {
        this.data.push(row);
    }


    public column(fname:string) : number
    {
        return(this.index.get(fname.toLowerCase()));
    }


    public clear() : void
    {
        this.data = [];
    }


    public getValue(record:number, column:string) : any
    {
        if (+record < 0 || +record >= +this.data.length)
        {
            console.log("get "+column+"["+record+"] record does not exist");
            return(null);
        }

        let colno:number = this.index.get(column.toLowerCase());

        if (colno == null)
        {
            console.log("get "+column+"["+record+"] column does not exist");
            return(null);
        }

        let rec:Row = this.data[+record];
        return(rec.fields[+colno].value$);
    }


    public getValidated(record:number, column?:string) : boolean
    {
        if (record < 0 || record >= this.data.length)
        {
            console.log("set "+column+"["+record+"] row does not exist");
            return(true);
        }

        let rec:Row = this.data[+record];
        if (column == null) return(rec.validated);

        let colno:number = this.index.get(column.toLowerCase());

        if (colno == null)
        {
            console.log("set "+column+"["+record+"] column does not exist");
            return;
        }

        return(rec.fields[+colno].validated);
    }


    public setValidated(record:number, column?:string) : void
    {
        if (record < 0 || record >= this.data.length)
        {
            console.log("set "+column+"["+record+"] row does not exist");
            return;
        }

        let rec:Row = this.data[+record];

        if (column == null)
        {
            rec.validated = true;
            return;
        }

        let colno:number = this.index.get(column.toLowerCase());

        if (colno == null)
        {
            console.log("set "+column+"["+record+"] column does not exist");
            return;
        }

        if (this.table != null && +colno < this.table.columns.length)
            rec.fields[+colno].validated = true;
    }


    public setValue(record:number, column:string, value:any) : boolean
    {
        if (record < 0 || record >= this.data.length)
        {
            console.log("set "+column+"["+record+"] row does not exist");
            return(false);
        }

        let colno:number = this.index.get(column.toLowerCase());

        if (colno == null)
        {
            console.log("set "+column+"["+record+"] column does not exist");
            return(false);
        }

        let rec:Row = this.data[+record];

        if (rec.fields[+colno].value$ == value)
            return(false);

        let scn:number = 0;

        if (this.table != null && +colno < this.table.columns.length)
        {
            scn = ++this.scn;
            rec.validated = false;
            rec.fields[+colno].validated = false;
        }

        rec.scn = scn;
        rec.fields[+colno].setValue(scn,value);

        return(true);
    }


    public state(record:number, state?:RecordState) : RecordState
    {
        if (state != null) this.data[record].state = state;
        return(this.data[record].state);
    }


    public parseQuery(keys:Key[], fields:Field[]) : Statement
    {
        if (this.table == null) return(null);
        return(this.table.parseQuery(keys,fields));
    }


    public async executequery(stmt:Statement) : Promise<any>
    {
        this.query = stmt;
        if (this.table == null) return({status: "ok"});
        return(this.table.executequery(stmt));
    }


    public insert(record:number) : boolean
    {
        let data:Row[] = [];
        if (record > this.data.length) record = this.data.length;

        data = this.data.slice(0,record);

        data[+record] = new Row(++this.scn,this);
        data[+record].state = RecordState.insert;

        data = data.concat(this.data.slice(record,this.data.length));

        this.data = data;
        return(true);
    }


    public delete(record:number) : boolean
    {
        let data:Row[] = [];

        if (record < 0 || record >= this.data.length)
            return(false);

        this.data[record].scn = ++this.scn;

        data = this.data.slice(0,record);
        data = data.concat(this.data.slice(+record+1,this.data.length));

        this.data = data;
        return(true);
    }


    public get rows() : number
    {
        return(this.data.length);
    }


    public async fetch(offset:number, rows:number) : Promise<number>
    {
        if (this.data.length <= +offset + rows && this.query != null)
        {
            let response:any = await this.table.fetch(this.query);

            if (response["status"] == "failed")
            {
                this.block.alert(JSON.stringify(response),"Database");
                return(0);
            }
        }

        let avail:number = this.data.length - offset - 1;
        if (avail < 0) avail = 0;

        return(avail);
    }


    public get(start:number, rows:number) : any[][]
    {
        let values:any[][] = [];
        if (start < 0) start = 0;
        let end:number = +start + rows;
        if (end > this.data.length) end = this.data.length;

        for(let i = start; i < end; i++)
            values.push(this.data[i].values);

        return(values);
    }
}


export class Row
{
    public scn:number = 0;
    public fields:Column[] = [];
    public locked:boolean = false;
    public validated:boolean = true;
    public state:RecordState = RecordState.na;


    constructor(scn:number, table:FieldData, values?:any[])
    {
        this.scn = scn;

        for(let i = 0; i < table.fields.length; i++)
            this.fields.push(new Column(scn));

        let i:number = 0;

        if (values != null) this.fields.forEach((column) =>
        {column.setValue(scn,values[i++])});
    }


    public setValue(col:number, value:any) : void
    {
        // Used by table
        this.fields[col].value$ = value;
    }


    public get values() : any[]
    {
        let values:any[] = [];
        this.fields.forEach((col) =>
        {
            let val:any = col.value$;
            if (val == null) val = "";
            values.push(col.value$)
        });
        return(values);
    }


    public print() : void
    {
        let i:number = 0;
        let values:string = "";
        this.fields.forEach((col) =>
        {
            let val:any = col.value$;
            if (val == null) val = "";
            values += i+" "+col.value$ + ", ";
            i++;
        });

        values = values.substring(0,values.length-2);
        console.log(values);
    }
}


class Column
{
    public value$:any;
    public scn:number = 0;
    public validated:boolean = true;

    constructor(scn:number, value?:any)
    {
        this.scn = scn;
        this.value$ = value;
        if (value == undefined) this.value$ = null;
    }

    public setValue(scn:number, value:any) : void
    {
        this.scn = scn;
        this.value$ = value;
        if (value == undefined) this.value$ = null;
    }
}