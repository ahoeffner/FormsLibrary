import { FieldDefinition } from "../input/FieldDefinition";


export class FieldDefinitions
{
    private static fields:Map<string,FieldDefinition[]> = new Map<string,FieldDefinition[]>();

    public static add(block:string, def:FieldDefinition) : void
    {
        let fields:FieldDefinition[] =  FieldDefinitions.fields.get(block);

        if (fields == null)
        {
            fields = [];
            FieldDefinitions.fields.set(block,fields);
        }

        fields.push(def);
    }


    public static get(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = new Map<string,FieldDefinition>();
        let fields:FieldDefinition[] =  FieldDefinitions.fields.get(block);
        if (fields != null) fields.forEach((field) => {index.set(field.name,field)});
        return(index);
    }
}