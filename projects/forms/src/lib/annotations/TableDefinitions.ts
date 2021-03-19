export class TableDefinitions
{
    private static index:Map<string,string> = new Map<string,string>();

    public static add(block:string, table:string) : void
    {
        TableDefinitions.index.set(block.toLowerCase(),table);
    }

    public static getTable(block:string) : string
    {
        return(TableDefinitions.index.get(block.toLowerCase()));
    }
}