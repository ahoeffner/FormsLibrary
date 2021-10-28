import { TableDefinition } from "../database/TableDefinition";

export class TableDefinitions
{
    private static index:Map<string,TableDefinition> = new Map<string,TableDefinition>();

    public static set(block:string, table:TableDefinition) : void
    {
        let def:TableDefinition = TableDefinitions.index.get(block.toLowerCase());

        if (def != null)
        {
            if (table.hasOwnProperty("name")) def.name = table.name;
            if (table.hasOwnProperty("order")) def.order = table.order;
        }
        else
        {
            TableDefinitions.index.set(block.toLowerCase(),table);
        }
    }

    public static get(block:string) : TableDefinition
    {
        return(TableDefinitions.index.get(block.toLowerCase()));
    }
}