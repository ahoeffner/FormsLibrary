import { Key } from "../input/Key";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { FieldInstance } from "../input/FieldInstance";

export class BlockBase
{
    public records:Record[] = [];
    public fields:Map<number,FieldInstance> = new Map<number,FieldInstance>();

    public getField(row:number, name:string) : Field
    {
        return(this.records[+row].getField(name));
    }

    // this is accessed behind the scenes
    private onEvent(field:FieldInstance, type:string, key?:Key) : void
    {
        console.log("event: "+type);
    }
}