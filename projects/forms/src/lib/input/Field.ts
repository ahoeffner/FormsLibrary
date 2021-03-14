import { FieldInstance } from "./FieldInstance";
import { BlockBaseImpl } from "../blocks/BlockBaseImpl";

export class Field
{
    private value$:any;
    private name$:string;
    private block$:BlockBaseImpl;
    private field:FieldInstance = null;
    private fields:FieldInstance[] = [];
    private current$:FieldInstance[] = [];
    private index:Map<string,FieldInstance> = new Map<string,FieldInstance>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public set block(block:BlockBaseImpl)
    {
        this.block$ = block;
    }

    public set current(flag:boolean)
    {
        if (!flag) this.current$.forEach((inst) => {inst.value = null;});
        else this.current$.forEach((inst) => {inst.value = this.value$;});
    }

    public get value() : any
    {
        return(this.fields[0].value);
    }

    public set value(value:any)
    {
        this.value$ = value;
        this.fields.forEach((inst) => {inst.value = value;});
    }

    public focus() : void
    {
        if (this.field != null)
        {
            this.field.focus();
        }
        else
        {
            for (let i = 0; i < this.fields.length; i++)
            {
                if (this.fields[i].enabled)
                {
                    this.fields[i].focus();
                    return;
                }
            }

            for (let i = 0; i < this.current$.length; i++)
            {
                if (this.current$[i].enabled)
                {
                    this.current$[i].focus();
                    return;
                }
            }
        }
    }

    public add(field:FieldInstance) : void
    {
        if (field.row == -2)
        {
            this.current$.push(field);
        }
        else
        {
            this.fields.push(field);
        }

        this.setindex(field);
    }

    public getFields() : FieldInstance[]
    {
        return(this.fields);
    }

    public getCurrentFields() : FieldInstance[]
    {
        return(this.current$);
    }

    public setType(type:string, id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.index.get(id.toLowerCase());
            if (field != null) field.type = type;
        }
        else
        {
            for (let i = 0; i < this.fields.length; i++)
                this.fields[i].type = type;

            for (let i = 0; i < this.current$.length; i++)
                this.current$[i].type = type;
        }
    }

    public enable(readonly:boolean, id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.index.get(id.toLowerCase());
            if (field != null)
            {
                field.enable = true;
                field.readonly = readonly;
            }
        }
        else
        {
            for (let i = 0; i < this.fields.length; i++)
            {
                this.fields[i].enable = true;
                this.fields[i].readonly = readonly;
            }

            if (this.current$)
            {
                for (let i = 0; i < this.current$.length; i++)
                {
                    this.current$[i].enable = true;
                    this.current$[i].readonly = readonly;
                }
            }
        }
    }

    public disable(id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.index.get(id.toLowerCase());
            if (field != null) field.enable = false;
        }
        else
        {
            for (let i = 0; i < this.fields.length; i++)
                this.fields[i].enable = false;

            if (this.current$)
            {
                for (let i = 0; i < this.current$.length; i++)
                    this.current$[i].enable = false;
            }
        }
    }

    // this is accessed behind the scenes
    private onEvent(event:any, field:FieldInstance, type:string, key?:string) : void
    {
        if (type == "blur") this.field = null;
        if (type == "focus") this.field = field;
        if (this.block$ != null) this.block$.onEvent(event,field,type,key);
    }

    private setindex(field:FieldInstance) : void
    {
        if (field.id.length > 0)
            this.index.set(field.id,field);
    }

    private remindex(field:FieldInstance) : void
    {
        if (field.id.length > 0)
            this.index.delete(field.id);
    }
}