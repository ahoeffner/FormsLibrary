import { FieldType } from "./FieldType";
import { keymap } from "../keymap/KeyMap";
import { RecordState } from "../blocks/Record";
import { BlockImpl } from "../blocks/BlockImpl";
import { FieldInstance } from "./FieldInstance";
import { FieldDefinition } from "./FieldDefinition";


export class Field
{
    private row$:number;
    private name$:string;
    private seq:number = 0;;
    private value$:any = "";
    private block$:BlockImpl;
    private def:FieldDefinition;
    private current$:boolean = false;
    private enabled$:boolean = false;
    private field:FieldInstance = null;
    private fields$:FieldInstance[] = [];
    private cfields$:FieldInstance[] = [];
    private state$:RecordState = RecordState.na;
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

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
    }


    public get cfields() : FieldInstance[]
    {
        return(this.cfields$);
    }

    public set valid(valid:boolean)
    {
        this.fields.forEach((inst) => {inst.valid = valid;});
        if (this.current) this.cfields.forEach((inst) => {inst.valid = valid;});
    }

    public getInstance(guid:string)
    {
        return(this.index.get(guid));
    }

    public getInstanceById(id:string) : FieldInstance
    {
        return(this.ids.get(id));
    }

    public getInstanceIds() : string[]
    {
        let ids:string[] = [];

        for(let key of this.ids.keys())
            ids.push(key);

        return(ids);
    }

    public getFirstInstance() : FieldInstance
    {
        if (this.fields.length > 0)
            return(this.fields[0]);

        if (this.current && this.cfields.length > 0)
        {
            let inst:FieldInstance = this.cfields[0];
            inst.row = this.row;
            return(inst);
        }

        return(null);
    }

    public get state() : RecordState
    {
        return(this.state$);
    }

    public get readonly() : boolean
    {
        for (let i = 0; i < this.fields.length; i++)
        {
            if (this.fields[i].enabled)
            {
                if (!this.fields[i].readonly)
                    return(false);
            }
        }

        if (this.current$)
        {
            for (let i = 0; i < this.cfields.length; i++)
            {
                if (this.cfields[i].enabled)
                {
                    if (!this.cfields[i].readonly)
                        return(false);
                }
            }
        }

        return(true);
    }

    public get current() : boolean
    {
        return(this.current$);
    }

    public set current(flag:boolean)
    {
        this.current$ = flag;

        if (!flag) this.cfields.forEach((inst) =>
        {
            inst.value = null;
            inst.disable();
        });
        else this.cfields.forEach((inst) =>
        {
            inst.parent = this;
            inst.row = this.row;
            inst.value = this.value$;

            inst.state = this.state;
            inst.readonly = this.readonly;

            inst.enable();
        });
    }

    public get value() : any
    {
        return(this.value$);
    }

    public set value(value:any)
    {
        this.value$ = value;
        this.fields.forEach((inst) => {inst.value = value;});
        if (this.current) this.cfields.forEach((inst) => {inst.value = value;});
    }

    public get enabled() : boolean
    {
        return(this.enabled$);
    }

    public focus() : boolean
    {
        if (this.field != null && this.field.enabled)
        {
            if (this.field.focus())
                return(true);
        }

        for (let i = 0; i < this.fields.length; i++)
        {
            if (this.fields[i].enabled)
            {
                if (this.fields[i].focus())
                    return(true);
            }
        }

        if (this.current$)
        {
            for (let i = 0; i < this.cfields.length; i++)
            {
                if (this.cfields[i].enabled)
                {
                    if (this.cfields[i].focus())
                        return(true);
                }
            }
        }

        return(false);
    }

    public add(field:FieldInstance) : void
    {
        field.parent = this;

        if (field.row == -1)
        {
            this.cfields.push(field);
            if (field.guid == null) field.guid = "c:"+(this.seq++);
        }
        else
        {
            this.fields.push(field);
            field.guid = "f:"+(this.seq++);
        }

        this.index.set(field.guid,field);

        if (field.id.length > 0)
            this.ids.set(field.id,field);
    }

    public get definition() : FieldDefinition
    {
        if (this.def == null)
        {
            let ff:FieldInstance = this.getFirstInstance();
            return(ff.definition);
        }

        return(this.def);
    }

    public setDefinition(def:FieldDefinition, cascade:boolean)
    {
        this.def = def;

        if (cascade)
        {
            for (let i = 0; i < this.fields.length; i++)
                this.fields[i].definition = def;

            for (let i = 0; i < this.cfields.length; i++)
                this.cfields[i].definition = def;
        }
    }


    public set state(state:RecordState)
    {
        this.state$ = state;
        this.fields.forEach((field) => {field.state = state;});
        if (this.current) this.cfields.forEach((field) => {field.state = state;});
    }


    public enable(readonly:boolean) : void
    {
        this.enabled$ = true;
        this.fields.forEach((field) => {field.readonly = readonly; field.enable();});
        if (this.current) this.cfields.forEach((field) => {field.readonly = readonly; field.enable();});
    }


    public disable() : void
    {
        this.enabled$ = false;
        this.fields.forEach((field) => {field.disable()});
        if (this.current) this.cfields.forEach((field) =>  {field.disable()});
    }


    public validate() : boolean
    {
        let valid:boolean = true;
        let inst:FieldInstance = null;

        for (let i = 0;  i < this.fields.length; i++)
        {
            inst = this.fields[i];

            if (!this.fields[i].validate())
            {
                valid = false;
                break;
            }
        }

        if (valid && this.current)
        {
            for (let i = 0;  i < this.cfields.length; i++)
            {
                inst = this.cfields[i];

                if (!this.cfields[i].validate())
                {
                    valid = false;
                    break;
                }
            }
        }

        this.valid = valid;
        if (inst != null) this.copy(inst);

        return(valid);
    }


    public async onEvent(event:any, field:FieldInstance, type:string, key?:keymap)
    {
        if (type == "blur") this.field = null;
        if (type == "focus") this.field = field;
        if (type == "cchange" || type == "change") this.copy(field);
        if (this.block$ != null) this.block$.onEvent(event,field,type,key);
    }


    public copy(field:FieldInstance)
    {
        this.value$ = field.value;

        this.fields.forEach((inst) =>
        {if (inst != field) inst.value = this.value$;});

        this.cfields.forEach((inst) =>
        {if (inst != field) inst.value = this.value$;});
    }
}