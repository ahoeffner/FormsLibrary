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
            if (field != null) field.enable =flag;
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
            this.fields[i].enable = flag;
    }

    public enableCurrent(flag:boolean) : void
    {
        for (let i = 0; i < this.current$.length; i++)
            this.current$[i].enable = flag;
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