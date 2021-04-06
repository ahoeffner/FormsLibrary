import { dates } from "../dates/dates";
import { TextField } from "./TextField";


export class DateField extends TextField
{
    private dateval:Date = null;
    private formatted:string = null;

    public get value() : any
    {
        if (this.element$.value == this.formatted)
            return(this.dateval);

        return(this.element$.value);
    }

    public set value(value:any)
    {
        if (value == null || value.constructor.name != "Date")
        {
            if (value != this.formatted)
            {
                this.dateval = null;
                this.formatted = value;
                this.element$.value = value;
            }
        }
        else
        {
            this.dateval = value;
            this.formatted = dates.format(value);
            this.element$.value = this.formatted;
        }
    }

    public validate() : boolean
    {
        let strval:string = this.element$.value;

        if (strval == this.formatted)
            return(true);

        this.formatted = null;
        this.dateval = dates.parse(strval);

        if (this.dateval == null && strval != null)
            return(false);

        if (this.dateval != null)
            this.formatted = dates.format(this.dateval);

        this.element$.value = this.formatted;
        return(true);
    }
}