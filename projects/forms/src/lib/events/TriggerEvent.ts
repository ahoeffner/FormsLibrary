import { Trigger } from "./Triggers";
import { Statement } from "../database/Statement";
import { Key, KeyMapper } from "../keymap/KeyMap";
import { FieldInstance } from "../input/FieldInstance";


export class TriggerEvent
{
    public jsevent:any;
    public type:string;

    constructor(type:string, jsevent:any)
    {
        this.type = type;
        this.jsevent = jsevent;
    }
}


export class KeyTriggerEvent extends TriggerEvent
{
    public key:Key;
    public row:number;
    public code:string;
    public field:string;

    constructor(event:any, key:string, field:FieldInstance)
    {
        super(Trigger.Key.name,event);

        this.code = key;
        this.jsevent = event;
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
    public row:number;
    public field:string;
    public previous:any;

    constructor(type:Trigger, field:string, row:number, value:any, previous:any)
    {
        super(type.name,null);

        this.row = row;
        this.field = field;
        this.value = value;
        this.previous = previous;
    }
}


export class SQLTriggerEvent extends TriggerEvent
{
    public stmt:Statement;

    constructor(type:Trigger, stmt:Statement)
    {
        super(type.name,null);
        this.stmt = stmt;
    }
}
