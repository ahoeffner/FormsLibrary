import { TextField } from "./TextField";

export class DateField extends TextField
{
    public get value() : any
    {
        return(this.element$.value);
    }

    public set value(value:any)
    {
        if (value == null) this.element$.value = null;
        else               this.element$.value = value;
    }
}