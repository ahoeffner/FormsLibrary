import { Key } from "./Key";
import { Field } from "./Field";

export class FieldGroup
{
    private name$:string;
    private last:Field[] = [];
    private first:Field[] = [];
    private fields:Field[] = [];
    private current:Field[] = [];

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public add(field:Field) : void
    {
        if (field.row == -1)
        {
            this.addFirst(field);
            return;
        }

        if (field.row == -2)
        {
            this.addCurrent(field);
            return;
        }

        if (field.row == -3)
        {
            this.addLast(field);
            return;
        }

        this.fields.push(field);
    }

    public addLast(field:Field) : void
    {
        this.last.push(field);
    }

    public addFirst(field:Field) : void
    {
        this.first.push(field);
    }

    public addCurrent(field:Field) : void
    {
        this.current.push(field);
    }

    public removeFields() : void
    {
        this.fields = [];
    }

    public removeLastFields() : void
    {
        this.last = [];
    }

    public removeFirstFields() : void
    {
        this.first = [];
    }

    public removeCurrentFields() : void
    {
        this.current = [];
    }

    public getFields() : Field[]
    {
        return(this.fields);
    }

    public getLastFields() : Field[]
    {
        return(this.last);
    }

    public getFirstFields() : Field[]
    {
        return(this.first);
    }

    public getCurrentFields() : Field[]
    {
        return(this.current);
    }

    public onEvent(type:string, key?:Key) : void
    {

    }
}