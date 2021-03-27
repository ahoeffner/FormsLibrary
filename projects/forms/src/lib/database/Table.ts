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
    private fetch:number;
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
        this.fetch = rows;
        this.table = table;
        this.columns = columns;
        this.fielddef = fielddef;

        if (this.key == null)
        {
            this.key = new Key("primary");
            this.columns.forEach((col) => {this.key.add(col.name)});
        }

        this.fetch *= 4;
        if (this.fetch < 10) this.fetch = 10;

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


    public async execute(stmt:Statement) : Promise<any>
    {
        let sql:SQL = stmt.build();
        if (stmt.type == SQLType.select) sql.rows = this.fetch;
        let response:any = await this.conn.invoke(SQLType[stmt.type],sql);

        if (response["status"] == "failed")
            return(response);

        this.fielddata.clear();
        let rows:any[] = response["rows"];
        let klen:number = this.key.columns.length;

        rows.forEach((row) =>
        {
            let col:number = 0;
            let keys:any[] = [];
            let drow:Row = this.fielddata.row;

            Object.keys(row).forEach((key) =>
            {
                let val = row[key];
                drow.setValue(col++,val);
                if (keys.length < klen) keys.push(val);
            });

            this.fielddata.row = drow;
            drow.print();
        });

        return(true);
    }


    public parseQuery(keys:Key[], fields:Field[]) : Statement
    {
        let stmt:Statement = new Statement(SQLType.select);

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
}