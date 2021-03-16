import { DatabaseUsage } from "../database/DatabaseUsage";


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


class Row
{
    public scn:number = 0;
    public columns:Column[] = [];

    constructor(scn:number, table:TableData, columns?:any[])
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


export class TableData
{
    private table:string;
    private scn:number = 0;
    private data:Row[] = [];
    private columns$:string[];
    private deleted$:Row[] = [];
    private usage:DatabaseUsage;
    private index:Map<string,number> = new Map<string,number>();


    public constructor(table:string, usage:DatabaseUsage, columns:string[])
    {
        this.table = table;
        this.usage = usage;
        this.columns$ = columns;

        for(let i = 0; i < columns.length; i++)
            this.index.set(columns[i].toLowerCase(),i);

        if (table == null && usage.update && !usage.insert)
        {
            let row:Row = new Row(++this.scn,this);
            this.data.push(row);
        }
    }


    public get columns() : string[]
    {
        return(this.columns$);
    }


    public insert(before:number) : boolean
    {
        if (!this.usage.insert)
            return(false);

        let data:Row[] = [];

        if (before > 0)
            data = this.data.slice(0,before);

        data[before] = new Row(++this.scn,this);

        if (before < this.data.length)
            data = data.concat(this.data.slice(before,this.data.length));

        this.data = data;

        return(true);
    }


    public delete(row:number) : boolean
    {
        if (!this.usage.delete)
            return(false);

        let data:Row[] = [];

        if (row < 0 || row >= this.data.length)
            return(false);

        this.data[row].scn = ++this.scn;
        this.deleted$.push(this.data[row]);

        if (row > 0)
            data = this.data.slice(0,row);

        if (row < this.data.length)
            data = data.concat(this.data.slice(row,this.data.length));

        this.data = data;

        return(true);
    }


    public update(row:number, col:string, value:any) : boolean
    {
        if (!this.usage.update)
            return(false);

        if (row < 0 || row >= this.data.length)
            return(false);

        let colno:number = this.index.get(col.toLowerCase());

        if (colno == null)
            return(false);

        let rec:Row = this.data[+row];

        if (rec.columns[+colno].value$ != value)
        {
            let scn:number = ++this.scn;

            rec.scn = scn;
            rec.columns[+colno].setValue(scn,value);
        }
    }


    public async fetch(offset:number, rows:number) : Promise<number>
    {
        if (this.data.length <= +offset + rows && this.table != null)
        {
            console.log("has "+this.data.length+" wants "+(+offset + rows));
        }

        let avail:number = this.data.length - offset;
        if (avail < 0) avail = 0;

        return(avail);
    }


    public get(start:number, rows:number) : any[][]
    {
        let values:any[][] = [];
        let end:number = +start + rows;
        if (end > this.data.length) end = this.data.length;

        for(let i = start; i < end; i++)
        {
            console.log("row "+i);
            this.data[i].values.forEach((val) => {console.log(val)});
            values.push(this.data[i].values);
        }

        return(values);
    }
}