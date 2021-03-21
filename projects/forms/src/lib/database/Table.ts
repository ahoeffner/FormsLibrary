import { Key } from "../blocks/Key";
import { Condition } from "./Condition";
import { Connection } from "./Connection";
import { TableDefinition } from "./TableDefinition";
import { ColumnDefinition } from "./ColumnDefinition";

export class Table
{
    private key:Key;
    private conn:Connection;
    private table:TableDefinition;
    private columns:ColumnDefinition[];


    constructor(conn:Connection, table:TableDefinition, key:Key, columns:ColumnDefinition[])
    {
        this.key = key;
        this.conn = conn;
        this.table = table;
        this.columns = columns;
    }


    public parseQuery(keys:Key[], criterias:Condition[])
    {

    }
}