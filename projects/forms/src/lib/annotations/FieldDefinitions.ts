import { FieldDefinition } from "../input/FieldDefinition";


export class FieldDefinitions
{
    // List and indexes for fields, columns and fields with id, respectively for form
    private static bfd:Map<string,FieldDefinition[]> = new Map<string,FieldDefinition[]>();
    private static bfx:Map<string,Map<string,FieldDefinition>> = new Map<string,Map<string,FieldDefinition>>();
    private static bcx:Map<string,Map<string,FieldDefinition>> = new Map<string,Map<string,FieldDefinition>>();
    private static bidx:Map<string,Map<string,FieldDefinition>> = new Map<string,Map<string,FieldDefinition>>();

    private static ffd:Map<string,Map<string,FieldDefinition[]>> = new Map<string,Map<string,FieldDefinition[]>>();
    private static ffx:Map<string,Map<string,Map<string,FieldDefinition>>> = new Map<string,Map<string,Map<string,FieldDefinition>>>();
    private static fcx:Map<string,Map<string,Map<string,FieldDefinition>>> = new Map<string,Map<string,Map<string,FieldDefinition>>>();
    private static fidx:Map<string,Map<string,Map<string,FieldDefinition>>> = new Map<string,Map<string,Map<string,FieldDefinition>>>();


    public static add(form:boolean, comp:string, def:FieldDefinition) : void
    {
        let parts:string[] = FieldDefinitions.split(def.name);

        if (form)
        {
            if (parts.length < 2 || parts.length > 3)
            {
                console.log("Form field "+def.name+" must be on the form block.field[.id], field definition ignored");
                return;
            }

            def.name = parts[1];
            let id:string = null;
            let block:string = parts[0];
            if (parts.length > 2) id = parts[2];

            if (id != null) FieldDefinitions.addformid(comp,block,id,def);
            else            FieldDefinitions.addformfield(comp,block,def);
        }
        else
        {
            if (parts.length > 2)
            {
                console.log("Block field "+def.name+" must be on the form field[.id], field definition ignored");
                return;
            }

            let id:string = null;
            if (parts.length > 1) id = parts[1];

            if (id != null) FieldDefinitions.addblockid(comp,id,def);
            else            FieldDefinitions.addblockfield(comp,def);
        }
    }


    private static addformfield(form:string, block:string, def:FieldDefinition) : void
    {
        let formbfd:Map<string,FieldDefinition[]> = FieldDefinitions.ffd.get(form);
        let formbfx:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.ffx.get(form);
        let formbcx:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.fcx.get(form);

        if (formbfd == null)
        {
            formbfd = new Map<string,FieldDefinition[]>();
            FieldDefinitions.ffd.set(form,formbfd);

            formbfx = new Map<string,Map<string,FieldDefinition>>();
            FieldDefinitions.ffx.set(form,formbfx);

            formbcx = new Map<string,Map<string,FieldDefinition>>();
            FieldDefinitions.fcx.set(form,formbcx);
        }

        let fields:FieldDefinition[] = formbfd.get(block);
        let index:Map<string,FieldDefinition> = formbfx.get(block);
        let columns:Map<string,FieldDefinition> = formbcx.get(block);

        if (fields == null)
        {
            fields = [];
            formbfd.set(block,fields);

            index = new Map<string,FieldDefinition>();
            formbfx.set(block,index);

            columns = new Map<string,FieldDefinition>();
            formbcx.set(block,columns);
        }

        if (def.hasOwnProperty("column"))
        {
            if (def.column.constructor.name == "Boolean")
            {
                if (!def.column) def.column = null;
                else             def.column = def.name;
            }

            if (def.column != null)
                def.column = (""+def.column).toLowerCase();
        }

        if (index.get(def.name) != null)
        {
            console.log("Field "+def.name+" defined twice on block '"+form+"."+block+"', ignored");
            return;
        }

        if (columns.get(def.name) != null)
        {
            console.log("Column "+def.column+" bound to more than 1 field on block '"+form+"."+block+"', ignored");
            def.column = null;
        }

        fields.unshift(def);
        index.set(def.name,def);
        if (def.column != null) columns.set(""+def.column,def);
    }


    private static addblockfield(block:string, def:FieldDefinition) : void
    {
        let fields:FieldDefinition[] = FieldDefinitions.bfd.get(block);
        let index:Map<string,FieldDefinition> = FieldDefinitions.bfx.get(block);
        let columns:Map<string,FieldDefinition> = FieldDefinitions.bcx.get(block);

        if (fields == null)
        {
            fields = [];
            FieldDefinitions.bfd.set(block,fields);

            index = new Map<string,FieldDefinition>();
            FieldDefinitions.bfx.set(block,index);

            columns = new Map<string,FieldDefinition>();
            FieldDefinitions.bcx.set(block,columns);
        }

        if (def.hasOwnProperty("column"))
        {
            if (def.column.constructor.name == "Boolean")
            {
                if (!def.column) def.column = null;
                else             def.column = def.name;
            }

            if (def.column != null)
                def.column = (""+def.column).toLowerCase();
        }

        if (index.get(def.name) != null)
        {
            console.log("Field "+def.name+" defined twice on block '"+block+"', ignored");
            return;
        }

        if (columns.get(def.name) != null)
        {
            console.log("Column "+def.column+" bound to more than 1 field on block '"+block+"', ignored");
            def.column = null;
        }

        fields.unshift(def);
        index.set(def.name,def);
        if (def.column != null) columns.set(""+def.column,def);
    }


    private static addformid(form:string, block:string, id:string, def:FieldDefinition) : void
    {
        let formids:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.fidx.get(form);

        if (formids == null)
        {
            formids = new Map<string,Map<string,FieldDefinition>>();
            FieldDefinitions.fidx.set(form,formids);
        }

        let blockids:Map<string,FieldDefinition> = formids.get(block);

        if (blockids == null)
        {
            blockids = new Map<string,FieldDefinition>();
            formids.set(block,blockids);
        }

        if (blockids.get(id) != null)
        {
            console.log("Field "+form+"."+def.name+"."+id+" defined twice, ignored");
            return;
        }

        if (def.column != null)
        {
            console.log("Field "+form+"."+def.name+"."+id+" cannot override column definition, ignored");
            def.column = null;
        }

        blockids.set(id,def);
    }


    private static addblockid(block:string, id:string, def:FieldDefinition) : void
    {
        let blockids:Map<string,FieldDefinition> = FieldDefinitions.bidx.get(block);

        if (blockids == null)
        {
            blockids = new Map<string,FieldDefinition>();
            FieldDefinitions.bidx.set(block,blockids);
        }

        if (blockids.get(id) != null)
        {
            console.log("Field "+def.name+"."+id+" defined twice, ignored");
            return;
        }

        if (def.column != null)
        {
            console.log("Field "+def.name+"."+id+" cannot override column definition, ignored");
            def.column = null;
        }

        blockids.set(id,def);
    }


    public static getFormFieldOverride(form:string, block:string, id:string) : FieldDefinition
    {
        let formids:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.fidx.get(form);
        if (formids == null) return(null);

        let blockids:Map<string,FieldDefinition> = FieldDefinitions.bidx.get(block.toLowerCase());
        if (blockids != null) return(blockids.get(id.toLowerCase()));

        return(null);
    }


    public static getFieldOverride(block:string, id:string) : FieldDefinition
    {
        let blockids:Map<string,FieldDefinition> = FieldDefinitions.bidx.get(block.toLowerCase());
        if (blockids != null) return(blockids.get(id.toLowerCase()));
        return(null);
    }


    public static getFormFields(form:string, block:string) : FieldDefinition[]
    {
        let formbfd:Map<string,FieldDefinition[]> = FieldDefinitions.ffd.get(form.toLowerCase());
        if (formbfd == null) return([]);

        let fields:FieldDefinition[] = formbfd.get(block.toLowerCase());
        if (fields == null) return([]);

        return(fields);
    }


    public static getFields(block:string) : FieldDefinition[]
    {
        let fields:FieldDefinition[] = FieldDefinitions.bfd.get(block.toLowerCase());
        if (fields == null) return([]);
        return(fields);
    }


    public static getFormFieldIndex(form:string, block:string) : Map<string,FieldDefinition>
    {
        let formbfx:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.ffx.get(form.toLowerCase());
        if (formbfx == null) return(new Map<string,FieldDefinition>());

        let index:Map<string,FieldDefinition> = formbfx.get(block.toLowerCase());
        if (index == null) return(new Map<string,FieldDefinition>());

        return(new Map(index));
    }


    public static getFieldIndex(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = FieldDefinitions.bfx.get(block.toLowerCase());
        if (index == null) return(new Map<string,FieldDefinition>());
        return(new Map(index));
    }


    public static getFormColumnIndex(form:string, block:string) : Map<string,FieldDefinition>
    {
        let formbcx:Map<string,Map<string,FieldDefinition>> = FieldDefinitions.fcx.get(form.toLowerCase());
        if (formbcx == null) return(new Map<string,FieldDefinition>());

        let index:Map<string,FieldDefinition> = formbcx.get(block.toLowerCase());
        if (index == null) return(new Map<string,FieldDefinition>());

        return(new Map(index));
    }


    public static getColumnIndex(block:string) : Map<string,FieldDefinition>
    {
        let index:Map<string,FieldDefinition> = FieldDefinitions.bcx.get(block.toLowerCase());
        if (index == null) index = new Map<string,FieldDefinition>();
        return(new Map(index));
    }


    private static split(name:string) : string[]
    {
        let tokens:string[] = name.split(".");

        for(let i = 0; i < tokens.length; i++)
            tokens[i] = tokens[i].trim().toLowerCase();

        return(tokens);
    }
}