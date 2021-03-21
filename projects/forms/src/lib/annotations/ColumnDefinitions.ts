import { ColumnDefinition } from "../database/ColumnDefinition";

export class ColumnDefinitions
{
    private static index:Map<string,ColumnDefinition[]> = new Map<string,ColumnDefinition[]>();

    public static add(block:string, def:ColumnDefinition) : void
    {
        let columns:ColumnDefinition[] =  ColumnDefinitions.index.get(block);

        if (columns == null)
        {
            columns = [];
            ColumnDefinitions.index.set(block,columns);
        }

        columns.unshift(def);
    }


    public static get(block:string) : ColumnDefinition[]
    {
        let columns:ColumnDefinition[] = ColumnDefinitions.index.get(block.toLowerCase());
        if (columns == null) columns = [];
        return(columns);
    }


    public static getIndex(block:string) : Map<string,ColumnDefinition>
    {
        let index:Map<string,ColumnDefinition> = new Map<string,ColumnDefinition>();
        let columns:ColumnDefinition[] = ColumnDefinitions.index.get(block.toLowerCase());
        if (columns != null) columns.forEach((column) => {index.set(column.name,column)});
        return(index);
    }
}