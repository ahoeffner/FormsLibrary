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

        fields.unshift(def);
    }


    public static getFields(block:string) : FieldDefinition[]
    {
        let fields:FieldDefinition[] =  FieldDefinitions.index.get(block);
        if (fields == null) fields = [];
        return(fields);
    }


    public static getFieldIndex(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = new Map<string,FieldDefinition>();
        let fields:FieldDefinition[] =  FieldDefinitions.index.get(block);
        if (fields != null) fields.forEach((field) => {index.set(field.name,field)});
        return(index);
    }
}