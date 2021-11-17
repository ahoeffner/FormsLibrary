import { dates } from "../dates/dates";
import { TextField } from "./TextField";


export class DateTimeField extends TextField
{
    private dateval:Date = null;
    private formatted:string = null;

    public get value() : any
    {
        if (this.element$.value == this.formatted)
        {
            // Invalid date
            if (this.formatted.length > 0 && this.dateval == null)
                return(this.formatted);

            return(this.dateval);
        }

        return(this.element$.value);
    }

    public set value(value:any)
    {
        if (value == null || value.constructor.name != "Date")
        {
            if (value != this.formatted || value != this.element$.value)
            {
                this.dateval = null;
                this.formatted = value;
                this.element$.value = value;
            }
        }
        else
        {
            this.dateval = value;
            this.formatted = dates.formattime(value);
            this.element$.value = this.formatted;
        }
    }

    public validate() : boolean
    {
        let strval:string = this.element$.value;

        if (strval == this.formatted)
        {
            if (strval != null && dates.parsetime(strval) == null)
                return(false);

            return(true);
        }

        this.formatted = null;
        this.dateval = dates.parsetime(strval);

        if (this.dateval == null && strval != null)
            return(false);

        if (this.dateval != null)
            this.formatted = dates.formattime(this.dateval);

        this.element$.value = this.formatted;
        return(true);
    }
}