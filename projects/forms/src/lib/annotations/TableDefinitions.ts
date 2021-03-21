import { TableDefinition } from "../database/TableDefinition";

export class TableDefinitions
{
    private static index:Map<string,TableDefinition> = new Map<string,TableDefinition>();

    public static set(block:string, table:TableDefinition) : void
    {
        TableDefinitions.index.set(block.toLowerCase(),table);
    }

    public static get(block:string) : TableDefinition
    {
        return(TableDefinitions.index.get(block.toLowerCase()));
    }
}