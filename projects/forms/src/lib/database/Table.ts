import { Connection } from "./Connection";
import { TableDefinition } from "../annotations/TableDefinition";

export class Table
{
    private scn:number = 0;
    private data:Row[] = [];
    private conn:Connection;
    private columns$:string[];
    private table:TableDefinition;
    private index:Map<string,number> = new Map<string,number>();


    public constructor(conn:Connection, table:TableDefinition, columns:string[])
    {
        this.conn = conn;
        this.table = table;
        this.columns$ = columns;

        for(let i = 0; i < columns.length; i++)
            this.index.set(columns[i].toLowerCase(),i);
    }


    public get columns() : string[]
    {
        return(this.columns$);
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

        if (rec.columns[+colno].value$ == value)
            return(false);

        let scn:number = ++this.scn;

        rec.scn = scn;
        rec.columns[+colno].setValue(scn,value);

        return(true);
    }


    public get rows() : number
    {
        return(this.data.length);
    }


    public async fetch(offset:number, rows:number) : Promise<number>
    {
        if (this.data.length <= +offset + rows && this.table != null)
        {
            //fetch
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


class Row
{
    public scn:number = 0;
    public columns:Column[] = [];

    constructor(scn:number, table:Table, columns?:any[])
    {
        this.scn = scn;

        for(let i = 0; i < table.columns.length; i++)
            this.columns.push(new Column(scn));

        let i:number = 0;

        if (columns != null) this.columns.forEach((column) =>
        {column.setValue(scn,columns[i++])});
    }

    public get values() : any[]
    {
        let values:any[] = [];
        this.columns.forEach((col) =>
        {
            let val:any = col.value$;
            if (val == null) val = "";
            values.push(col.value$)
        });
        return(values);
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