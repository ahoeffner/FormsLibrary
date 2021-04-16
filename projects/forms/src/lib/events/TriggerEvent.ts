import { keymap } from "../keymap/KeyMap";
import { Statement } from "../database/Statement";
import { FieldInstance } from "../input/FieldInstance";


export class TriggerEvent
{
    private event$:any;
    private type$:string;
    private record$:number;

    constructor(record:number, jsevent?:any)
    {
        this.record$ = record;
        this.event$ = jsevent;
    }

    public get type() : string
    {
        return(this.type$);
    }

    public get event() : any
    {
        return(this.event$);
    }

    public get record() : number
    {
        return(this.record$);
    }
}


export class KeyTriggerEvent extends TriggerEvent
{
    private key$:keymap;
    private field$:string;

    constructor(field:FieldInstance, key:keymap, jsevent:any)
    {
        super(0,jsevent);

        this.key$ = key;

        if (field != null)
        {
            this.field$ = field.name;
            this["record$"] = field.row;
        }
    }

    public get key() : keymap
    {
        return(this.key$);
    }

    public get field() : string
    {
        return(this.field$);
    }
}


export class FieldTriggerEvent extends TriggerEvent
{
    private value$:any;
    private id$:string;
    private block$:string;
    private field$:string;
    private previous$:any;

    constructor(block:string, field:string, id:string, row:number, value:any, previous:any, jsevent?:any)
    {
        super(row,jsevent);

        this.id$ = id;
        this.block$ = block;
        this.field$ = field;
        this.value$ = value;
        this.previous$ = previous;
    }

    public get value() : any
    {
        return(this.value$);
    }

    public get block() : string
    {
        return(this.field$);
    }

    public get field() : string
    {
        return(this.field$);
    }

    public get id() : string
    {
        return(this.id$);
    }

    public get previous() : any
    {
        return(this.previous$);
    }
}


export class SQLTriggerEvent extends TriggerEvent
{
    private stmt$:Statement;

    constructor(row:number,stmt:Statement)
    {
        super(row,null);
        this.stmt$ = stmt;
    }

    public get stmt() : Statement
    {
        return(this.stmt$);
    }

    public set stmt(stmt:Statement)
    {
        this.stmt$ = stmt;
    }
}
