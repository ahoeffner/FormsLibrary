import { Trigger } from "./Triggers";
import { keymap } from "../keymap/KeyMap";
import { Statement } from "../database/Statement";
import { FieldInstance } from "../input/FieldInstance";

export enum Origin
{
    Form,
    Block,
    Field
}


export class TriggerEvent
{
    private event$:any;
    private type$:Trigger;
    private block$:string;
    private record$:number;

    constructor(block:string, record:number, jsevent?:any)
    {
        this.block$ = block;
        this.record$ = record;
        this.event$ = jsevent;
    }

    public get block() : string
    {
        return(this.block$);
    }

    public get type() : Trigger
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
    private origin$:number;

    constructor(origin:Origin, block:string, field:FieldInstance, key:keymap, jsevent:any)
    {
        super(block,0,jsevent);

        this.key$ = key;
        this.origin$ = origin;

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

    public get origin() : number
    {
        return(this.origin$);
    }
}


export class FieldTriggerEvent extends TriggerEvent
{
    private value$:any;
    private id$:string;
    private field$:string;
    private previous$:any;

    constructor(block:string, field:string, id:string, row:number, value:any, previous:any, jsevent?:any)
    {
        super(block,row,jsevent);

        this.id$ = id;
        this.field$ = field;
        this.value$ = value;
        this.previous$ = previous;
    }

    public get value() : any
    {
        return(this.value$);
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

    constructor(block:string, row:number, stmt:Statement)
    {
        super(block,row,null);
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
