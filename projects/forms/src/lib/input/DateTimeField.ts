import { dates } from "../dates/dates";
import { TextField } from "./TextField";


export class DateTimeField extends TextField
{
    private dateval:Date = null;
    private formatted:string = null;
    private format:string = dates.getFormat()+" hh:MM:ss";

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
        console.log("Set DateTime, format: "+this.format+" value: "+value);
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
            this.formatted = dates.format(value,this.format);
            this.element$.value = this.formatted;
        }
    }

    public validate() : boolean
    {
        let strval:string = this.element$.value;

        if (strval == this.formatted)
        {
            if (strval != null && dates.parse(strval,this.format) == null)
                return(false);

            return(true);
        }

        this.formatted = null;
        this.dateval = dates.parse(strval,this.format);

        if (this.dateval == null && strval != null)
            return(false);

        if (this.dateval != null)
            this.formatted = dates.format(this.dateval,this.format);

        this.element$.value = this.formatted;
        return(true);
    }
}