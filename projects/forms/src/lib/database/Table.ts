import { Key } from "../blocks/Key";
import { Field } from "../input/Field";
import { Connection } from "./Connection";
import { TableDefinition } from "./TableDefinition";
import { FieldData, Row } from "../blocks/FieldData";
import { ColumnDefinition } from "./ColumnDefinition";
import { FieldDefinition } from "../input/FieldDefinition";
import { SQL, SQLType, Statement } from "../database/Statement";


export class Table
{
    private key:Key;
    private select:SQL;
    private eof:boolean;
    private fetch$:number;
    private cursor:string;
    private data:any[] = [];
    private cnames:string[];
    private conn:Connection;
    private fielddata$:FieldData;
    private table:TableDefinition;
    private columns:ColumnDefinition[];
    private fielddef:Map<string,FieldDefinition>;
    private index:Map<string,ColumnDefinition> = new Map<string,ColumnDefinition>();


    constructor(conn:Connection, table:TableDefinition, key:Key, columns:ColumnDefinition[], fielddef:Map<string,FieldDefinition>, rows:number)
    {
        this.key = key;
        this.conn = conn;
        this.table = table;
        this.fetch$ = rows;
        this.columns = columns;
        this.fielddef = fielddef;
        this.cursor = table.name + Date.now();;

        if (this.key == null)
        {
            this.key = new Key("primary");
            this.columns.forEach((col) => {this.key.add(col.name)});
        }

        this.fetch$ *= 4;
        if (this.fetch$ < 10) this.fetch$ = 10;

        this.cnames = [];
        this.columns.forEach((column) =>
        {
            this.cnames.push(column.name);
            this.index.set(column.name,column);
        });
    }


    public set fielddata(fielddata:FieldData)
    {
        this.fielddata$ = fielddata;
    }


    public get fielddata() : FieldData
    {
        return(this.fielddata$);
    }


    public parseQuery(keys:Key[], fields:Field[]) : Statement
    {
        let stmt:Statement = new Statement(SQLType.select);

        stmt.cursor = this.cursor;
        stmt.columns = this.cnames;
        stmt.table = this.table.name;
        stmt.order = this.table.order;

        keys.forEach((key) =>
        {
            key.columns.forEach((part) =>
            {
                let type:string = this.index.get(part.name).type;
                stmt.and(part.name,part.value,type);
            });
        });

        fields.forEach((field) =>
        {
            if (field.value != null && (""+field.value).trim() != "")
            {
                let def:FieldDefinition = this.fielddef.get(field.name);

                if (def.column != null)
                {
                    let type:string = this.index.get(""+def.column).type;
                    stmt.and(""+def.column,field.value,type);
                }
            }
        });

        return(stmt);
    }


    public async executequery(stmt:Statement) : Promise<any>
    {
        this.eof = false;
        this.fielddata.clear();
        this.select = stmt.build();

        this.select.rows = this.fetch$;
        this.select.cursor = stmt.cursor;

        let response:any = await this.conn.invoke("select",this.select);

        if (response["status"] == "failed")
            return(response);

        this.addRows(response["rows"]);
        return(true);
    }


    public async fetch(stmt:Statement) : Promise<any>
    {
        if (this.eof) return({status: "ok"});

        let fetch:any = {cursor: stmt.cursor, rows: this.fetch$};
        let response:any = await this.conn.invoke("fetch",fetch);

        if (response["status"] == "failed")
            return(response);

        this.addRows(response["rows"]);
        return(true);
    }


    private addRows(rows:any[]) : void
    {
        let klen:number = this.key.columns.length;
        if (rows.length < this.fetch$) this.eof = true;

        rows.forEach((row) =>
        {
            let col:number = 0;
            let keys:any[] = [];
            let drow:Row = this.fielddata.newrow();

            Object.keys(row).forEach((key) =>
            {
                let val = row[key];
                drow.setValue(col++,val);
                if (keys.length < klen) keys.push(val);
            });

            this.data.push(keys);
            this.fielddata.add(drow);
        });
    }
}