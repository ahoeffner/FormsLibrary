import { TextField } from "./TextField";

export class DateField extends TextField
{
    public get value() : any
    {
        return(this.element$.value);
    }

    public set value(value:any)
    {
        let date:Date = new Date();
        date.setTime(value);
        this.element$.value = ""+date;
    }
}