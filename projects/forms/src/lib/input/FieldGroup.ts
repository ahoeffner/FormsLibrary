import { Key } from "./Key";
import { Field } from "./Field";

export class FieldGroup
{
    private name$:string;
    private last:Field[] = [];
    private first:Field[] = [];
    private fields:Field[] = [];
    private current:Field[] = [];
    private index:Map<string,Field> = new Map<string,Field>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public add(field:Field) : void
    {
        if (field.row == -1)
        {
            this.addFirst(field);
            return;
        }

        if (field.row == -2)
        {
            this.addCurrent(field);
            return;
        }

        if (field.row == -3)
        {
            this.addLast(field);
            return;
        }

        this.setindex(field);
        this.fields.push(field);
    }

    public addLast(field:Field) : void
    {
        this.setindex(field);
        this.last.push(field);
    }

    public addFirst(field:Field) : void
    {
        this.setindex(field);
        this.first.push(field);
    }

    public addCurrent(field:Field) : void
    {
        this.setindex(field);
        this.current.push(field);
    }

    public removeFields() : void
    {
        this.fields = [];
        this.index.clear();
    }

    public removeLastFields() : void
    {
        for(let i = 0; i < this.last.length; i++)
            this.remindex(this.last[i]);

        this.last = [];
    }

    public removeFirstFields() : void
    {
        for(let i = 0; i < this.first.length; i++)
            this.remindex(this.first[i]);

        this.first = [];
    }

    public removeCurrentFields() : void
    {
        for(let i = 0; i < this.current.length; i++)
            this.remindex(this.current[i]);

        this.current = [];
    }

    public getFields() : Field[]
    {
        return(this.fields);
    }

    public getLastFields() : Field[]
    {
        return(this.last);
    }

    public getFirstFields() : Field[]
    {
        return(this.first);
    }

    public getCurrentFields() : Field[]
    {
        return(this.current);
    }

    public setType(type:string, id?:string) : void
    {
        if (id != null)
        {
            let field:Field = this.index.get(id.toLowerCase());
            if (field != null) field.type = type;
        }
        else
        {
            this.setLastType(type);
            this.setFieldType(type);
            this.setFirstType(type);
            this.setCurrentType(type);
        }
    }

    public setFieldType(type:string) : void
    {
        for (let i = 0; i < this.fields.length; i++)
            this.fields[i].type = type;
    }

    public setCurrentType(type:string) : void
    {
        for (let i = 0; i < this.current.length; i++)
            this.current[i].type = type;
    }

    public setFirstType(type:string) : void
    {
        for (let i = 0; i < this.first.length; i++)
            this.first[i].type = type;
    }

    public setLastType(type:string) : void
    {
        for (let i = 0; i < this.last.length; i++)
            this.last[i].type = type;
    }

    public enable(flag:boolean, id?:string) : void
    {
        if (id != null)
        {
            let field:Field = this.index.get(id.toLowerCase());
            if (field != null) field.enable(flag);
        }
        else
        {
            this.enableLast(flag);
            this.enableFirst(flag);
            this.enableFields(flag);
            this.enableCurrent(flag);
        }
    }

    public enableFields(flag:boolean) : void
    {
        for (let i = 0; i < this.fields.length; i++)
            this.fields[i].enable(flag);
    }

    public enableFirst(flag:boolean) : void
    {
        for (let i = 0; i < this.first.length; i++)
            this.first[i].enable(flag);
    }

    public enableCurrent(flag:boolean) : void
    {
        for (let i = 0; i < this.current.length; i++)
            this.current[i].enable(flag);
    }

    public enableLast(flag:boolean) : void
    {
        for (let i = 0; i < this.last.length; i++)
            this.last[i].enable(flag);
    }

    // this is accessed behind the scenes
    private onEvent(type:string, key?:Key) : void
    {
        console.log("event: "+type);
    }

    private setindex(field:Field) : void
    {
        if (field.id.length > 0)
            this.index.set(field.id,field);
    }

    private remindex(field:Field) : void
    {
        if (field.id.length > 0)
            this.index.delete(field.id);
    }
}