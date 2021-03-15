import { Field } from "../input/Field";
import { FieldInstance } from "../input/FieldInstance";


export class Record
{
    public row:number = 0;
    public fields:Field[] = [];
    public index:Map<string,Field> = new Map<string,Field>();


    constructor(row:number, fields:Field[], index:Map<string,Field>)
    {
        this.row = row;
        this.index = index;
        this.fields = fields;
    }

    public set current(flag:boolean)
    {
        this.fields.forEach((field) => {field.current = flag});
    }

    public disable() : void
    {
        this.fields.forEach((field) => {field.disable()});
    }

    public enable(readonly?:boolean) : void
    {
        this.fields.forEach((field) => {field.enable(readonly)});
    }

    public getField(name:string) : Field
    {
        return(this.index.get(name.toLowerCase()));
    }

    public getFieldByGuid(name:string, guid:string) : FieldInstance
    {
        let field:Field = this.index.get(name.toLowerCase());
        if (field != null) return(field.getInstance(guid));
        return(null);
    }
}