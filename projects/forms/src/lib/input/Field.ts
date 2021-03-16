import { Record } from "../blocks/Record";
import { BlockImpl } from "../blocks/BlockImpl";
import { FieldInstance } from "./FieldInstance";

export class Field
{
    private row$:number;
    private name$:string;
    private seq:number = 0;;
    private value$:any = "";
    private block$:BlockImpl;
    private field:FieldInstance = null;
    private fields$:FieldInstance[] = [];
    private current$:FieldInstance[] = [];
    private ids:Map<string,FieldInstance> = new Map<string,FieldInstance>();
    private index:Map<string,FieldInstance> = new Map<string,FieldInstance>();

    constructor(name:string, row:number)
    {
        this.row$ = row;
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public get row() : number
    {
        return(this.row$);
    }

    public set block(block:BlockImpl)
    {
        this.block$ = block;
    }

    public get block() : BlockImpl
    {
        return(this.block$);
    }

    public getInstance(guid:string)
    {
        return(this.index.get(guid));
    }

    public set current(flag:boolean)
    {
        setTimeout(() =>
        {
            if (!flag) this.current$.forEach((inst) => {inst.value = null;});
            else this.current$.forEach((inst) => {inst.field = this; inst.row = this.row; inst.value = this.value$;});
        },1);
    }

    public get value() : any
    {
        return(this.value$);
    }

    public set value(value:any)
    {
        this.value$ = value;
        this.fields$.forEach((inst) => {inst.value = value;});
        if (this.current) this.current$.forEach((inst) => {inst.value = value;});
    }

    public focus() : void
    {
        if (this.field != null)
        {
            this.field.focus();
        }
        else
        {
            for (let i = 0; i < this.fields$.length; i++)
            {
                if (this.fields$[i].enabled)
                {
                    this.fields$[i].focus();
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
        field.field = this;

        if (field.row == -2)
        {
            this.current$.push(field);
            if (field.guid == null) field.guid = "c:"+(this.seq++);
        }
        else
        {
            this.fields$.push(field);
            field.guid = "r:"+(this.seq++);
        }

        this.index.set(field.guid,field);
        if (field.id.length > 0) this.ids.set(field.id,field);
 }

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
    }

    public get currxfields() : FieldInstance[]
    {
        return(this.current$);
    }


    public setType(type:string, id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.ids.get(id.toLowerCase());
            if (field != null) field.type = type;
        }
        else
        {
            for (let i = 0; i < this.fields$.length; i++)
                this.fields$[i].type = type;

            for (let i = 0; i < this.current$.length; i++)
                this.current$[i].type = type;
        }
    }


    public enable(readonly:boolean, id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.ids.get(id.toLowerCase());
            if (field != null)
            {
                field.enable = true;
                field.readonly = readonly;
            }
        }
        else
        {
            for (let i = 0; i < this.fields$.length; i++)
            {
                this.fields$[i].enable = true;
                this.fields$[i].readonly = readonly;
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
            let field:FieldInstance = this.ids.get(id.toLowerCase());
            if (field != null) field.enable = false;
        }
        else
        {
            for (let i = 0; i < this.fields$.length; i++)
                this.fields$[i].enable = false;

            if (this.current$)
            {
                for (let i = 0; i < this.current$.length; i++)
                    this.current$[i].enable = false;
            }
        }
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string)
    {
        if (type == "blur") this.field = null;
        if (type == "focus") this.field = field;
        if (type == "ichange") this.copy(field,true);
        if (type == "change") this.copy(field,false);
        if (this.block$ != null) this.block$.onEvent(event,field,type,key);
    }


    private copy(field:FieldInstance, wait:boolean)
    {
        if (wait)
        {
            setTimeout(() =>
            {
                this.value$ = field.value;

                this.fields$.forEach((inst) =>
                {if (inst != field) inst.value = this.value$;});

                this.current$.forEach((inst) =>
                {if (inst != field) inst.value = this.value$;});
            },0);
        }
        else
        {
            this.value$ = field.value;

            this.fields$.forEach((inst) =>
            {if (inst != field) inst.value = this.value$;});

            this.current$.forEach((inst) =>
            {if (inst != field) inst.value = this.value$;});
        }
    }
}