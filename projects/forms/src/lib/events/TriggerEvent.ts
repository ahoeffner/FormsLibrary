import { Trigger } from "./Triggers";
import { Statement } from "../database/Statement";
import { Key, KeyMapper } from "../keymap/KeyMap";
import { FieldInstance } from "../input/FieldInstance";


export class TriggerEvent
{
    public row:number;
    public jsevent:any;
    public type:string;

    constructor(row:number, jsevent?:any)
    {
        this.row = row;
        this.jsevent = jsevent;
    }
}


export class KeyTriggerEvent extends TriggerEvent
{
    public key:Key;
    public code:string;
    public field:string;

    constructor(field:FieldInstance, key:string, jsevent:any)
    {
        super(0,jsevent);

        this.code = key;
        this.jsevent = jsevent;
        this.key = KeyMapper.parse(key);
        this.key.name = KeyMapper.keyname(key);

        if (field != null)
        {
            this.row = field.row;
            this.field = field.name;
        }
    }
}


export class FieldTriggerEvent extends TriggerEvent
{
    public value:any;
    public field:string;
    public previous:any;

    constructor(field:string, row:number, value:any, previous:any, jsevent?:any)
    {
        super(row,jsevent);
        this.field = field;
        this.value = value;
        this.previous = previous;
    }
}


export class SQLTriggerEvent extends TriggerEvent
{
    public stmt:Statement;

    constructor(row:number,stmt:Statement)
    {
        super(row,null);
        this.stmt = stmt;
    }
}
