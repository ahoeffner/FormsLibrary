import { Column } from "./Column";
import { Key } from "../blocks/Key";
import { Field } from "../input/Field";
import { Connection } from "./Connection";
import { TableDefinition } from "./TableDefinition";
import { FieldData, Row } from "../blocks/FieldData";
import { ColumnDefinition } from "./ColumnDefinition";
import { NameValuePair } from "../utils/NameValuePair";
import { FieldDefinition } from "../input/FieldDefinition";
import { SQL, SQLType, Statement } from "../database/Statement";


export class Table
{
    private key:Key;
    private select:SQL;
    private eof:boolean;
    private fetch$:number;
    private cursor:string;
    private keys:any[] = [];
    private cnames:string[];
    private conn:Connection;
    private dates:boolean[] = [];
    private fielddata$:FieldData;
    private table:TableDefinition;
    private criterias:NameValuePair[];
    private columns$:ColumnDefinition[];
    private fielddef:Map<string,FieldDefinition>;
    private index:Map<string,ColumnDefinition> = new Map<string,ColumnDefinition>();


    constructor(conn:Connection, table:TableDefinition, key:Key, columns:ColumnDefinition[], fielddef:Map<string,FieldDefinition>, rows:number)
    {
        this.key = key;
        this.conn = conn;
        this.table = table;
        this.fetch$ = rows;
        this.criterias = [];
        this.columns$ = columns;
        this.fielddef = fielddef;
        this.cursor = table.name + Date.now();

        if (this.key == null)
        {
            this.key = new Key("primary");
            this.columns$.forEach((col) => {this.key.addColumn(col.name)});
        }

        if (this.table.where != null)
        {
            this.table.where = this.table.where.trim();

            if (this.table.where.startsWith("where "))
                this.table.where = this.table.where.substring(6);

            if (this.table.where.startsWith("and "))
                this.table.where = this.table.where.substring(4);

            if (this.table.where.length == 0)
                this.table.where = null;
        }

        this.fetch$ *= 4;
        if (this.fetch$ < 10) this.fetch$ = 10;

        this.cnames = [];
        this.columns$.forEach((column) =>
        {
            this.cnames.push(column.name);
            this.index.set(column.name,column);

            let date:boolean = false;
            if (column.type == Column.date || column.type == Column.datetime)
                date = true;

            this.dates.push(date);
        });
    }


    public get name() : string
    {
        return(this.table.name);
    }


    public get tabdef()
    {
        return(this.table)
    }


    public get columns() : string[]
    {
        return(this.cnames);
    }


    public mandatory(column:string) : boolean
    {
        let def:ColumnDefinition = this.index.get(column);
        if (def == null || def.mandatory == null) return(false);
        return(def.mandatory);
    }


    public databasecolumn(column:string) : boolean
    {
        return(this.index.has(column.toLowerCase()));
    }


    public set fielddata(fielddata:FieldData)
    {
        this.fielddata$ = fielddata;
    }


    public get fielddata() : FieldData
    {
        return(this.fielddata$);
    }


    public get searchfilter() : NameValuePair[]
    {
        return(this.criterias);
    }


    public set searchfilter(filter:NameValuePair[])
    {
        this.criterias = filter;
    }


    public async lock(record:number, data:any[]) : Promise<any>
    {
        let cols:NameValuePair[] = [];

        for (let i = 0; i < this.columns.length; i++)
            cols.push({name: this.columns[i], value: data[i]});

        let where:boolean = true;
        let stmt:Statement = new Statement(SQLType.lock);

        stmt.columns = this.columns;
        stmt.table = this.table.name;

        for (let i = 0; i < this.keys[record].length; i++)
        {
            let type:Column = this.index.get(this.columns[i]).type;

            if (!where) stmt.and(this.columns[i],this.keys[record][i],type);
            else        stmt.where(this.columns[i],this.keys[record][i],type);

            where = false;
        }

        let lock:SQL = stmt.build();
        let response:any = await this.conn.invoke("lock",lock);

        if (response["status"] == "failed")
        {
            console.log(JSON.stringify(response));
            return({status: "failed", message: "Row is locked by another user. Try later"});
        }

        let rows:any[] = response["rows"];

        if (rows.length == 0)
        {
            console.log("Row["+record+"] has been deleted by another user. Requery to see changes")
            return({status: "failed", message: "Row["+record+"] has been deleted by another user. Requery to see changes"});
        }

        let row:any = rows[0];

        for (let i = 0; i < this.columns.length; i++)
        {
            let cval:any = cols[i].value;

            if (cval != null && this.dates[i])
                cval = (cval as Date).getTime();

            if (row[this.columns[i]] != cval)
            {
                let problem:string = cols[i].name+"["+record+"], db: "+row[this.columns[i]]+" != "+cval;
                console.log("Row has been changed by another user. Requery to see changes");
                return({status: "failed", message: "Row has been changed by another user. Requery to see changes"});
            }
        }

        return({status: "ok"});
    }


    public async insert(record:number, data:any[]) : Promise<any>
    {
        let cols:NameValuePair[] = [];

        for (let i = 0; i < this.columns.length; i++)
            cols.push({name: this.columns[i], value: data[i]});

        let stmt:Statement = new Statement(SQLType.insert);

        stmt.columns = this.columns;
        stmt.table = this.table.name;

        let keyval:any[] = [];

        for (let i = 0; i < this.columns.length; i++)
        {
            let cval:any = cols[i].value;
            let type:Column = this.index.get(this.columns[i]).type;

            if (cval != null && this.dates[i])
                cval = (cval as Date).getTime();

            if (i < this.key.columns().length)
                keyval.push(cval);

            stmt.bind(cols[i].name,cval,type);
        }

        let insert:SQL = stmt.build();
        this.keys.splice(+record,0,keyval);
        let response:any = await this.conn.invoke("insert",insert);

        return(response);
    }


    public async update(record:number, data:NameValuePair[]) : Promise<any>
    {
        let keyupd:any[] = [];
        let keyval:any[] = this.keys[+record];
        let stmt:Statement = new Statement(SQLType.update);

        for (let i = 0; i < data.length; i++)
        {
            if (i < this.key.columns().length)
                keyupd.push(keyval[i]);

            if (data[i].value.updated)
            {
                let val:any = data[i].value.newvalue;
                let type:Column = this.index.get(data[i].name).type;

                if (val != null && this.dates[i])
                    val = (val as Date).getTime();

                if (i < this.key.columns().length)
                    keyupd[i] = val;

                stmt.update(data[i].name,val,type);
            }
        }

        let where:boolean = true;

        if (this.table.where != null && this.table.where.trim.length > 0)
        {
            where = false;
            stmt.constraint = this.table.where;
        }

        for (let i = 0; i < keyval.length; i++)
        {
            let type:Column = this.index.get(this.columns[i]).type;

            if (!where) stmt.and(this.columns[i],keyval[i],type);
            else        stmt.where(this.columns[i],keyval[i],type);

            where = false;
        }

        stmt.table = this.table.name;

        let update:SQL = stmt.build();
        let response:any = await this.conn.invoke("update",update);

        if (response["status"] != "failed")
            this.keys[+record] = keyupd;

        return(response);
    }


    public async delete(record:number) : Promise<any>
    {
        let keyval:any[] = this.keys[+record];
        let stmt:Statement = new Statement(SQLType.delete);

        let where:boolean = true;

        if (this.table.where != null && this.table.where.trim.length > 0)
        {
            where = false;
            stmt.constraint = this.table.where;
        }

        for (let i = 0; i < keyval.length; i++)
        {
            let type:Column = this.index.get(this.columns[i]).type;

            if (!where) stmt.and(this.columns[i],keyval[i],type);
            else        stmt.where(this.columns[i],keyval[i],type);

            where = false;
        }

        stmt.table = this.table.name;

        let delrow:SQL = stmt.build();
        let response:any = await this.conn.invoke("delete",delrow);

        if (response["status"] == "failed")
            return(response);

        let keys:any[] = this.keys.slice(0,record);
        keys = keys.concat(this.keys.slice(+record+1,this.keys.length));

        this.keys = keys;
        return(response);
    }


    public parseQuery(keys:Key[], subquery:SQL, fields:Field[]) : Statement
    {
        let stmt:Statement = new Statement(SQLType.select);

        stmt.cursor = this.cursor;
        stmt.columns = this.cnames;
        stmt.table = this.table.name;
        stmt.order = this.table.order;

        let where:boolean = true;

        if (this.table.limit != null)
            stmt.limit = this.table.limit;

        if (this.table.where != null)
        {
            where = false;
            stmt.constraint = this.table.where;
        }

        if (fields.length > 0)
        {
            this.criterias = [];
            fields.forEach((field) =>
            {
                if (field.value != null && (""+field.value).trim() != "")
                    this.criterias.push({name: field.name, value: field.value});
            });
        }

        keys.forEach((key) =>
        {
            key.values.forEach((part) =>
            {
                let col:string = part.name;

                // Check if key column is mapped to diff. name
                let def:FieldDefinition = this.fielddef.get(col);
                if (def != null) col = def.column;

                let type:Column = this.index.get(col).type;

                if (!where) stmt.and(col,part.value,type);
                else        stmt.where(col,part.value,type);

                where = false;
            });
        });

        this.criterias.forEach((field) =>
        {
            let def:FieldDefinition = this.fielddef.get(field.name);

            if (def.column != null)
            {
                let type:Column = this.index.get(def.column).type;

                if (!where) stmt.and(def.column,field.value,type);
                else        stmt.where(def.column,field.value,type);

                where = false;
            }
        });

        if (subquery != null)
            stmt.subquery = subquery;

        return(stmt);
    }


    public async executequery(stmt:Statement, nowait:boolean) : Promise<any>
    {
        this.keys = [];
        this.eof = false;
        this.fielddata.clear();
        this.select = stmt.build();

        this.select.rows = this.fetch$;
        this.select.cursor = stmt.cursor;

        let response:any = await this.conn.invoke("select",this.select,nowait);

        if (response["status"] == "failed")
            return(response);

        this.addRows(response["rows"]);
        return(response);
    }


    public async fetch(stmt:Statement) : Promise<any>
    {
        if (this.eof) return({status: "ok"});

        let fetch:any = {cursor: stmt.cursor, rows: this.fetch$};
        let response:any = await this.conn.invoke("fetch",fetch);

        if (response["status"] == "failed")
            return(response);

        this.addRows(response["rows"]);
        return(response);
    }


    private addRows(rows:any[]) : void
    {
        let klen:number = this.key.values.length;
        if (rows.length < this.fetch$) this.eof = true;

        rows.forEach((row) =>
        {
            // Table is not defined
            if (this.cnames.length == 0)
            {
                let keys:string[] = Object.keys(row);
                let flds:string[] = this.fielddata.fields;
                let addcols:number = keys.length - flds.length;

                for(let i = addcols-1; i >= 0; i--)
                    flds.unshift(keys[i]);

                for(let i = 0; i < flds.length; i++)
                    this.cnames.push(flds[i]);

                this.fielddata.fields = flds;
            }

            let col:number = 0;
            let keyval:any[] = [];
            let drow:Row = this.fielddata.newrow();

            Object.keys(row).forEach((key) =>
            {
                let val = row[key];

                if (this.dates[col] && (""+val).length > 0)
                    val = new Date(+val);

                drow.setValue(col++,val);
                if (keyval.length < klen) keyval.push(val);
            });

            this.keys.push(keyval);
            this.fielddata.add(drow);
        });
    }
}