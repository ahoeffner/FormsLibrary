import { Key } from "../blocks/Key";
import { Field } from "../input/Field";
import { Connection } from "./Connection";
import { TableDefinition } from "./TableDefinition";
import { ColumnDefinition } from "./ColumnDefinition";
import { FieldDefinition } from "../input/FieldDefinition";
import { SQL, SQLType, Statement } from "../database/Statement";


export class Table
{
    private key:Key;
    private fetch:number;
    private cnames:string[];
    private conn:Connection;
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

        this.fetch *= 4;
        if (this.fetch < 10) this.fetch = 10;

        this.cnames = [];
        this.columns.forEach((column) =>
        {
            this.cnames.push(column.name);
            this.index.set(column.name,column);
        });
    }


    public async execute(stmt:Statement) : Promise<boolean>
    {
        let sql:SQL = stmt.build();
        if (stmt.type == SQLType.select) sql.rows = this.fetch;
        let response:any = await this.conn.invoke(SQLType[stmt.type],sql);
        console.log("Response "+JSON.stringify(response));
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