import { dates } from "../dates/dates";
import { TextField } from "./TextField";
import { Config } from "../application/Config";


export class DateField extends TextField
{
    private dateval:Date = null;
    private format:string = null;
    private formatted:string = null;


    public setConfig(config:Config) :  void
    {
        this.format = config.dateformat;
    }

    public get strvalue() : string
    {
        return(this.element$.value);
    }

    public get value() : Date
    {
        if (this.strvalue == this.formatted)
            return(this.dateval);

        this.validate();
        return(this.dateval);
    }

    public set value(value:Date)
    {
        if (value == null || value.constructor.name != "Date")
        {
            this.dateval = null;
            this.formatted = null;
            return;
        }

        this.dateval = value;
        this.formatted = dates.format(value,this.format);

        this.element$.value = this.formatted;
    }

    public validate() : boolean
    {
        if (this.strvalue == this.formatted)
            return(true);

        this.formatted = null;
        this.dateval = dates.parse(this.strvalue,this.format);

        if (this.dateval == null && this.strvalue != null)
            return(false);

        if (this.dateval != null)
            this.formatted = dates.format(this.dateval,this.format);

        return(true);
    }
}