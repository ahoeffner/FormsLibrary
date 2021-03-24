import { Key, KeyMapper } from "../keymap/KeyMap";
import { FieldInstance } from "../input/FieldInstance";


export class TriggerEvent
{
    public type:string;

    constructor(type:string)
    {
        this.type = type;
    }
}


export class KeyTriggerEvent extends TriggerEvent
{
    public key:Key;
    public row:number;
    public field:string;

    constructor(type:string, key:string, field:FieldInstance)
    {
        super(type);
        this.key = KeyMapper.parse(key);
        this.key.name = KeyMapper.key(key);

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

    constructor(type:string, field:FieldInstance)
    {
        super(type);
        this.row = field.row;
        this.field = field.name;
        this.value = field.value;
    }
}
