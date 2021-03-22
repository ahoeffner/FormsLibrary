import { Field } from "../input/Field";
import { FormState } from "../forms/FormState";
import { FieldInstance } from "../input/FieldInstance";


export class Record
{
    public row:number = 0;
    public rec:number = 0;
    public fields:Field[] = [];
    public enabled:boolean = false;
    public index:Map<string,Field> = new Map<string,Field>();


    constructor(row:number, fields:Field[], index:Map<string,Field>)
    {
        this.row = row;
        this.rec = row;
        this.index = index;
        this.fields = fields;
    }

    public set record(rec:number)
    {
        this.rec = rec;
    }

    public get record() : number
    {
        return(this.rec);
    }

    public focus(state:FormState) : void
    {
        this.fields[0].focus();
    }

    public set current(flag:boolean)
    {
        this.fields.forEach((field) => {field.current = flag});
    }

    public clear(current?:boolean) : void
    {
        if (current) this.fields.forEach((field) => {field.current = true});
        this.fields.forEach((field) => {field.value = null; field.disable()});
    }

    public disable() : void
    {
        this.enabled = false;
        this.fields.forEach((field) => {field.disable()});
    }

    public enable(readonly?:boolean) : void
    {
        this.enabled = true;
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