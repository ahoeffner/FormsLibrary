import { Statement } from "../database/Statement";
import { Key, KeyMapper } from "../keymap/KeyMap";
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
    private key$:Key;
    private code$:string;
    private field$:string;

    constructor(field:FieldInstance, key:string, jsevent:any)
    {
        super(0,jsevent);

        this.code$ = key;
        this.key$ = KeyMapper.parse(key);
        this.key$.name = KeyMapper.keyname(key);

        if (field != null)
        {
            this.field$ = field.name;
            this["record$"] = field.row;
        }
    }

    public get key() : Key
    {
        return(this.key$);
    }

    public get keymap() : string
    {
        return(this.code$);
    }

    public get field() : string
    {
        return(this.field$);
    }
}


export class FieldTriggerEvent extends TriggerEvent
{
    private value$:any;
    private field$:string;
    private previous$:any;

    constructor(field:string, row:number, value:any, previous:any, jsevent?:any)
    {
        super(row,jsevent);
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
