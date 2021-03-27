import { Key } from "./Key";
import { Field } from "../input/Field";
import { BlockImpl } from "./BlockImpl";
import { Table } from "../database/Table";
import { Statement } from "../database/Statement";


export class FieldData
{
    private table:Table;
    private scn:number = 0;
    private query:Statement;
    private block:BlockImpl;
    private data:Row[] = [];
    private fields$:string[];
    private index:Map<string,number> = new Map<string,number>();


    public constructor(block:BlockImpl, table:Table, fields:string[])
    {
        this.block = block;
        this.table = table;
        this.fields$ = fields;
        this.table.fielddata = this;

        if (fields != null)
        {
            for(let i = 0; i < fields.length; i++)
                this.index.set(fields[i].toLowerCase(),i);
        }
    }


    public get fields() : string[]
    {
        return(this.fields$);
    }


    public get row() : Row
    {
        let row:Row = new Row(++this.scn,this);
        return(row);
    }


    public set row(row:Row)
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


    public isNew(row:number) : boolean
    {
        return(this.data[row].status == status.insert);
    }


    public parseQuery(keys:Key[], fields:Field[]) : Statement
    {
        if (this.table == null) return(null);
        return(this.table.parseQuery(this.block.alias,keys,fields));
    }


    public async executequery(stmt:Statement) : Promise<any>
    {
        this.query = stmt;
        if (this.table == null) return({status: "ok"});
        return(this.table.executequery(stmt));
    }


    public insert(row:number) : boolean
    {
        let data:Row[] = [];
        if (row > this.data.length) row = this.data.length;

        data = this.data.slice(0,row);
        data[row] = new Row(++this.scn,this);
        data = data.concat(this.data.slice(row,this.data.length));

        this.data = data;
        return(true);
    }


    public delete(row:number) : boolean
    {
        let data:Row[] = [];

        if (row < 0 || row >= this.data.length)
            return(false);

        this.data[row].scn = ++this.scn;

        data = this.data.slice(0,row);
        data = data.concat(this.data.slice(+row+1,this.data.length));

        this.data = data;
        return(true);
    }


    public update(row:number, col:string, value:any) : boolean
    {
        if (row < 0 || row >= this.data.length)
            return(false);

        let colno:number = this.index.get(col.toLowerCase());

        if (colno == null)
            return(false);

        let rec:Row = this.data[+row];

        if (rec.fields[+colno].value$ == value)
            return(false);

        let scn:number = ++this.scn;

        rec.scn = scn;
        rec.fields[+colno].setValue(scn,value);

        return(true);
    }


    public get rows() : number
    {
        return(this.data.length);
    }


    public async fetch(offset:number, rows:number) : Promise<number>
    {
        if (this.data.length <= +offset + rows && this.query != null)
            this.table.fetch(this.query);

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


enum status
{
    query,
    insert
}


export class Row
{
    public scn:number = 0;
    public fields:Column[] = [];
    public status:status = status.insert;

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