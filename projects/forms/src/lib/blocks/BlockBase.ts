import { Key } from "../input/Key";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { FieldInstance } from "../input/FieldInstance";

export class BlockBase
{
    private records:Map<number,Record> = new Map<number,Record>();
    private fields$:Map<number,FieldInstance> = new Map<number,FieldInstance>();

    public getRecord(row:number) : Record
    {
        return(this.records[+row]);
    }

    public addRecord(record:Record) : void
    {
        this.records.set(+record.row,record);
        record.fields.forEach((field) => {field.block = this});
    }

    public set fields(fields:Map<number,FieldInstance>)
    {
        this.fields$ = fields;
    }

    public getField(row:number, name:string) : Field
    {
        return(this.records.get(+row)?.getField(name));
    }

    public getFieldInstance(id:number) : FieldInstance
    {
        return(this.fields$.get(+id));
    }

    // this is accessed behind the scenes
    private onEvent(field:FieldInstance, type:string, key?:Key) : void
    {
    }
}