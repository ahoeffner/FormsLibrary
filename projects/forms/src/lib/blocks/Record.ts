import { Field } from "../input/Field";


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
        this.fields.forEach((field) => {field.current = true});
    }

    public getField(name:string) : Field
    {
        return(this.index.get(name.toLowerCase()));
    }
}