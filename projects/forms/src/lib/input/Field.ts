import { Key } from "./Key";
import { FieldInstance } from "./FieldInstance";
import { BlockBase } from "../blocks/BlockBase";

export class Field
{
    private name$:string;
    private block$:BlockBase;
    private last:FieldInstance[] = [];
    private first:FieldInstance[] = [];
    private fields:FieldInstance[] = [];
    private current:FieldInstance[] = [];
    private index:Map<string,FieldInstance> = new Map<string,FieldInstance>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public set block(block:BlockBase)
    {
        this.block$ = block;
    }

    public add(field:FieldInstance) : void
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

    public addLast(field:FieldInstance) : void
    {
        this.setindex(field);
        this.last.push(field);
    }

    public addFirst(field:FieldInstance) : void
    {
        this.setindex(field);
        this.first.push(field);
    }

    public addCurrent(field:FieldInstance) : void
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

    public getFields() : FieldInstance[]
    {
        return(this.fields);
    }

    public getLastFields() : FieldInstance[]
    {
        return(this.last);
    }

    public getFirstFields() : FieldInstance[]
    {
        return(this.first);
    }

    public getCurrentFields() : FieldInstance[]
    {
        return(this.current);
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
            let field:FieldInstance = this.index.get(id.toLowerCase());
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
    private onEvent(field:FieldInstance, type:string, key?:Key) : void
    {
        if (this.block$ != null) this.block$["onEvent"](field,type,key);
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