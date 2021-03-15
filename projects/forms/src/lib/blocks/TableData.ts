export class Column
{
    public value:any;
    constructor(value:any) {this.value = value}
}


export class Row
{
    public columns:Column[] = [];

    constructor(columns?:any[]|number)
    {
        if (columns != null)
        {
            if (columns.constructor.name == "Array")
            {
                (columns as any[]).forEach((column) =>
                {this.columns.push(new Column(column));});
            }
            else
            {
                for(let i = 0; i < +columns; i++)
                    this.columns.push(new Column(""));
            }
        }
    }
}


export class TableData
{
    private data:Row[] = [];

    public insert(before:number) : boolean
    {
        let data:Row[] = [];

        if (before > 0)
            data = this.data.slice(0,before);

        data[before] = new Row();

        if (before < this.data.length)
            data = data.concat(this.data.slice(before,this.data.length));

        this.data = data;

        return(true);
    }

    public update(row:number, data:any[]) : boolean
    {
        if (row > this.data.length)
            return(false);

        if (data.length != this.data.length)
            return(false);

        for(let i = 0; i < data.length; i++)
        {
            let col:Column = this.data[row].columns[i];
            col.value = data[i];
        }
    }

    public delete(row:number) : boolean
    {
        let data:Row[] = [];

        if (row > 0)
            data = this.data.slice(0,row);

        if (row < this.data.length)
            data = data.concat(this.data.slice(row,this.data.length));

        this.data = data;

        return(true);
    }
}