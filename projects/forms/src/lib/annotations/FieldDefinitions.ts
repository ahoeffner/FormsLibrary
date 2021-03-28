import { FieldDefinition } from "../input/FieldDefinition";


export class FieldDefinitions
{
    private static idx:Map<string,Map<string,FieldDefinition>> = new Map<string,Map<string,FieldDefinition>>();
    private static index:Map<string,FieldDefinition[]> = new Map<string,FieldDefinition[]>();


    public static add(block:string, def:FieldDefinition) : void
    {
        if (def.id != null)
        {
            FieldDefinitions.addidx(block,def);
            return;
        }

        let fields:FieldDefinition[] = FieldDefinitions.index.get(block);

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


    private static addidx(block:string, def:FieldDefinition) : void
    {
        let blockids:Map<string,FieldDefinition> = FieldDefinitions.idx.get(block);

        if (blockids == null)
        {
            blockids = new Map<string,FieldDefinition>();
            FieldDefinitions.idx.set(block,blockids);
        }

        if (def.hasOwnProperty("column"))
        {
            def.column = null;
            console.log("Column cannot be specified for instance override "+def.name+"."+def.id);
        }

        blockids.set(def.id,def);
    }


    public static getInstanceDefinition(block:string, id:string) : FieldDefinition
    {
        let blockids:Map<string,FieldDefinition> = FieldDefinitions.idx.get(block);

        if (blockids != null)
            return(blockids.get(id));

        return(null);
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
        let fields:FieldDefinition[] = FieldDefinitions.index.get(block.toLowerCase());
        if (fields != null) fields.forEach((field) =>
        {
            if (field.column != null)
                index.set(""+field.column,field);
        });
        return(index);
    }
}