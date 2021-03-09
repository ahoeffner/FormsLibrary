import { Field } from "./Field";

export class FieldGroup
{
    private last:Field[] = [];
    private first:Field[] = [];
    private fields:Field[] = [];
    private current:Field[] = [];

    public add(field:Field) : void
    {
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

    public onEvent(event:any) : void
    {

    }
}