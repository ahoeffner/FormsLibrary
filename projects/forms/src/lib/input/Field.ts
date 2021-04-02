import { FieldType } from "./FieldType";
import { RecordState } from "../blocks/Record";
import { BlockImpl } from "../blocks/BlockImpl";
import { FieldInstance } from "./FieldInstance";

export class Field
{
    private row$:number;
    private name$:string;
    private seq:number = 0;;
    private value$:any = "";
    private block$:BlockImpl;
    private current$:boolean = false;
    private field:FieldInstance = null;
    private fields$:FieldInstance[] = [];
    private currfields$:FieldInstance[] = [];
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

    public getFirstInstance() : FieldInstance
    {
        if (this.fields.length > 0)
            return(this.fields[0]);

        if (this.current && this.currfields$.length > 0)
        {
            let inst:FieldInstance = this.currfields$[0];
            inst.row = this.row;
            return(inst);
        }

        return(null);
    }

    public get current() : boolean
    {
        return(this.current$);
    }

    public set current(flag:boolean)
    {
        this.current$ = flag;
        if (!flag) this.currfields$.forEach((inst) => {inst.value = null;});
        else this.currfields$.forEach((inst) => {inst.field = this; inst.row = this.row; inst.value = this.value$;});
    }

    public get value() : any
    {
        return(this.value$);
    }

    public set value(value:any)
    {
        this.value$ = value;
        this.fields$.forEach((inst) => {inst.value = value;});
        if (this.current) this.currfields$.forEach((inst) => {inst.value = value;});
    }

    public get enabled() : boolean
    {
        for (let i = 0; i < this.fields$.length; i++)
        {
            if (this.fields$[i].enabled)
                return(true);
        }

        if (this.current$)
        {
            for (let i = 0; i < this.currfields$.length; i++)
            {
                if (this.currfields$[i].enabled)
                    return(true);
            }
        }

        return(false);
    }

    public focus() : boolean
    {
        if (this.field != null && this.field.enabled)
        {
            if (this.field.focus())
                return(true);
        }

        for (let i = 0; i < this.fields$.length; i++)
        {
            if (this.fields$[i].enabled)
            {
                if (this.fields$[i].focus())
                    return(true);
            }
        }

        if (this.current$)
        {
            for (let i = 0; i < this.currfields$.length; i++)
            {
                if (this.currfields$[i].enabled)
                {
                    if (this.currfields$[i].focus())
                        return(true);
                }
            }
        }

        return(false);
    }

    public add(field:FieldInstance) : void
    {
        field.field = this;

        if (field.row == -2)
        {
            this.currfields$.push(field);
            if (field.guid == null) field.guid = "c:"+(this.seq++);
        }
        else
        {
            this.fields$.push(field);
            field.guid = "f:"+(this.seq++);
        }

        this.index.set(field.guid,field);

        if (field.id.length > 0)
        {
            if (this.ids.get(field.id) != null)
            {
                console.log("id "+field.id+" is not unique within "+field.name+", ignored");
                return;
            }

            this.ids.set(field.id,field);
        }
    }

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
    }


    public setType(type:FieldType, id?:string) : void
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

            for (let i = 0; i < this.currfields$.length; i++)
                this.currfields$[i].type = type;
        }
    }


    public enable(state:RecordState, readonly:boolean) : void
    {
        this.ids.forEach((field) =>
        {
            field.readonly = readonly;
            field.enable(state);
        });

        this.fields$.forEach((field) =>
        {
            field.readonly = readonly;
            field.enable(state);
        });

        if (this.current)
        {
            this.currfields$.forEach((field) =>
            {
                field.readonly = readonly;
                field.enable(state);
            });
        }
    }


    public disable(id?:string) : void
    {
        if (id != null)
        {
            let field:FieldInstance = this.ids.get(id.toLowerCase());
            if (field != null) field.disable();
        }
        else
        {
            for (let i = 0; i < this.fields$.length; i++)
                this.fields$[i].disable();

            if (this.currfields$)
            {
                for (let i = 0; i < this.currfields$.length; i++)
                    this.currfields$[i].disable();
            }
        }
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:string)
    {
        if (type == "blur") this.field = null;
        if (type == "focus") this.field = field;
        if (type == "ichange" || type == "change") this.copy(field);
        if (this.block$ != null) this.block$.onEvent(event,field,type,key);
    }


    private copy(field:FieldInstance)
    {
        this.value$ = field.value;

        this.fields$.forEach((inst) =>
        {if (inst != field) inst.value = this.value$;});

        this.currfields$.forEach((inst) =>
        {if (inst != field) inst.value = this.value$;});
    }
}