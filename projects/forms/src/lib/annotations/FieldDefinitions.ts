import { FieldDefinition } from "../input/FieldDefinition";


export class FieldDefinitions
{
    private static index:Map<string,FieldDefinition[]> = new Map<string,FieldDefinition[]>();

    public static add(block:string, def:FieldDefinition) : void
    {
        let fields:FieldDefinition[] =  FieldDefinitions.index.get(block);

        if (fields == null)
        {
            fields = [];
            FieldDefinitions.index.set(block,fields);
        }

        if (def.hasOwnProperty("column"))
        {
            if (def.column.constructor.name == "Boolean")
            {
                if (!def.column) def.column = null;
                else             def.column = def.name;
            }
        }

        fields.forEach((existing) =>
        {
            if (def.name == existing.name)
            {
                console.log("Field "+def.name+" defined twice");
                return;
            }

            if (def.column!= null && def.column == existing.column)
            {
                console.log("Column "+def.column+" defined twice");
                return;
            }
        });

        fields.unshift(def);
    }


    public static getFields(block:string) : FieldDefinition[]
    {
        let fields:FieldDefinition[] = FieldDefinitions.index.get(block);
        if (fields == null) fields = [];
        return(fields);
    }


    public static getIndex(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = new Map<string,FieldDefinition>();
        let fields:FieldDefinition[] = FieldDefinitions.index.get(block);
        if (fields != null) fields.forEach((field) => {index.set(field.name,field)});
        return(index);
    }


    public static getColumnIndex(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = new Map<string,FieldDefinition>();
        let fields:FieldDefinition[] = FieldDefinitions.index.get(block);
        if (fields != null) fields.forEach((field) =>
        {
            if (field.column != null)
                index.set(""+field.column,field);
        });
        return(index);
    }
}