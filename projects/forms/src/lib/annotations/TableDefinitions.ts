export class TableDefinitions
{
    private static index:Map<string,string> = new Map<string,string>();

    public static set(block:string, table:string) : void
    {
        TableDefinitions.index.set(block.toLowerCase(),table);
    }

    public static get(block:string) : string
    {
        return(TableDefinitions.index.get(block.toLowerCase()));
    }
}