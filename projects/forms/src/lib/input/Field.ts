import { BlockBase } from "../blocks/BlockBase";
import { FieldInstance } from "./FieldInstance";

export class Field
{
    private value$:any;
    private name$:string;
    private block$:BlockBase;
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

    public set block(block:BlockBase)
    {
        this.block$ = block;
    }

    public set current(flag:boolean)
    {
        if (!flag) this.current$.forEach((inst) => {inst.value = null;});
        else this.current$.forEach((inst) => {inst.value = this.value$;});
    }

    public set value(value:any)
    {
        this.value$ = value;
        this.fields.forEach((inst) => {inst.value = value;});
    }

    public add(field:FieldInstance) : void
    {
        if (field.row == -2)
        {
            this.addCurrent(field);
            return;
        }

        this.setindex(field);
        this.fields.push(field);
    }

    public addCurrent(field:FieldInstance) : void
    {
        this.setindex(field);
        this.current$.push(field);
    }

    public removeFields() : void
    {
        this.fields = [];
        this.index.clear();
    }

    public removeCurrentFields() : void
    {
        for(let i = 0; i < this.current$.length; i++)
            this.remindex(this.current$[i]);

        this.current$ = [];
    }

    public getInstance() : FieldInstance
    {
        return(this.field);
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
            this.setFieldType(type);
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
        for (let i = 0; i < this.current$.length; i++)
            this.current$[i].type = type;
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
            this.enableFields(flag);
            this.enableCurrent(flag);
        }
    }

    public enableFields(flag:boolean) : void
    {
        for (let i = 0; i < this.fields.length; i++)
            this.fields[i].enable(flag);
    }

    public enableCurrent(flag:boolean) : void
    {
        for (let i = 0; i < this.current$.length; i++)
            this.current$[i].enable(flag);
    }

    // this is accessed behind the scenes
    private onEvent(field:FieldInstance, type:string, key?:string) : void
    {
        if (type == "blur") this.field = null;
        if (type == "focus") this.field = field;
        if (this.block$ != null) this.block$["_onEvent"](field,type,key);
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