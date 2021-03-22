import { Key } from "../blocks/Key";
import { Condition } from "./Condition";
import { Connection } from "./Connection";
import { TableDefinition } from "./TableDefinition";
import { ColumnDefinition } from "./ColumnDefinition";

export class Table
{
    private key:Key;
    private fetch:number;
    private conn:Connection;
    private table:TableDefinition;
    private columns:ColumnDefinition[];


    constructor(conn:Connection, table:TableDefinition, key:Key, columns:ColumnDefinition[], fetch:number)
    {
        this.key = key;
        this.conn = conn;
        this.table = table;
        this.fetch = fetch;
        this.columns = columns;

        this.fetch *= 4;
        if (this.fetch < 10) this.fetch = 10;
    }


    public parseQuery(keys:Key[], criterias:Condition[])
    {

    }
}