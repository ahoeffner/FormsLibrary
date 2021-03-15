class Column
{
    public value$:any;
    public scn:number = 0;

    constructor(scn:number, value:any)
    {
        this.scn = scn;
        this.value$ = value;
    }

    public setValue(scn:number, value:any) : void
    {
        this.scn = scn;
        this.value$ = value;
    }
}


class Row
{
    public scn:number = 0;
    public columns:Column[] = [];

    constructor(scn:number, columns:any[]|number)
    {
        this.scn = scn;

        if (columns.constructor.name == "Array")
        {
            (columns as any[]).forEach((column) =>
            {this.columns.push(new Column(scn,column));});
        }
        else
        {
            for(let i = 0; i < columns; i++)
                this.columns.push(new Column(scn,""));
        }
    }
}


export class TableData
{
    private scn:number = 0;
    private data:Row[] = [];
    private deleted:Row[] = [];
    private columns:number = 0;
    private index:Map<string,number> = new Map<string,number>();


    public constructor(columns:string[])
    {
        this.columns = columns.length;

        for(let i = 0; i < columns.length; i++)
            this.index.set(columns[i].toLowerCase(),i);
    }


    public insert(before:number) : boolean
    {
        let data:Row[] = [];

        if (before > 0)
            data = this.data.slice(0,before);

        data[before] = new Row(++this.scn,this.columns);

        if (before < this.data.length)
            data = data.concat(this.data.slice(before,this.data.length));

        this.data = data;

        return(true);
    }


    public delete(row:number) : boolean
    {
        let data:Row[] = [];

        if (row < 0 || row >= this.data.length)
            return(false);

        this.data[row].scn = ++this.scn;
        this.deleted.push(this.data[row]);

        if (row > 0)
            data = this.data.slice(0,row);

        if (row < this.data.length)
            data = data.concat(this.data.slice(row,this.data.length));

        this.data = data;

        return(true);
    }


    public set(row:number, col:string, value:any) : boolean
    {
        if (row < 0 || row >= this.data.length)
            return(false);

        let colno:number = this.index.get(col.toLowerCase());

        if (colno == null)
            return(false);

        let rec:Row = this.data[+row];

        let scn:number = ++this.scn;;

        rec.scn = scn;
        rec.columns[+colno].setValue(scn,value);
    }


    public append(values:any[]) : boolean
    {
        if (values.length > this.columns)
            return(false);

        let row:Row = new Row(++this.scn,values);
        this.data.push(row);

        return(true);
    }
}