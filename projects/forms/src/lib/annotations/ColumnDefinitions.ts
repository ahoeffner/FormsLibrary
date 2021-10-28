import { ColumnDefinition } from "../database/ColumnDefinition";

export class ColumnDefinitions
{
    private static bcols:Map<string,ColumnDefinition[]> = new Map<string,ColumnDefinition[]>();
    private static bcidx:Map<string,Map<string,ColumnDefinition>> = new Map<string,Map<string,ColumnDefinition>>();

    public static add(block:string, def:ColumnDefinition) : void
    {
        let columns:ColumnDefinition[] = ColumnDefinitions.bcols.get(block);
        let index:Map<string,ColumnDefinition> = ColumnDefinitions.bcidx.get(block);

        if (columns == null)
        {
            columns = [];
            ColumnDefinitions.bcols.set(block,columns);

            index = new Map<string,ColumnDefinition>();
            ColumnDefinitions.bcidx.set(block,index);
        }

        if (index.get(def.name) != null)
        {
            console.log("Block "+block+" column "+def.name+" defined twice, ignored");
            return;
        }

        columns.unshift(def);
        index.set(def.name,def);
    }


    public static get(block:string) : ColumnDefinition[]
    {
        let columns:ColumnDefinition[] = ColumnDefinitions.bcols.get(block.toLowerCase());
        if (columns == null) columns = [];
        return(columns);
    }


    public static getIndex(block:string) : Map<string,ColumnDefinition>
    {
        let index:Map<string,ColumnDefinition> = ColumnDefinitions.bcidx.get(block.toLowerCase());
        if (index == null) index = new Map<string,ColumnDefinition>();
        return(index);
    }
}