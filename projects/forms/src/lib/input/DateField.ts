import { TextField } from "./TextField";
import { Config } from "../application/Config";


export class DateField extends TextField
{
    private dateval:Date = null;
    private stringval:string = null;

    private format:string = null;
    private dbformat:string = null;

    public setConfig(config:Config) :  void
    {
        console.log("got config")
        this.format = config.dateformat;
        this.dbformat = config.databasedateformat;
    }


    public get strvalue() : string
    {
        return(this.element$.value);
    }

    public set strvalue(str:string)
    {
        this.element$.value = str;
    }

    public get value() : Date
    {
        let curr:string = this.element$.value;
        if (curr == this.stringval) return(this.dateval);
        return(DateField.parse(curr, this.format, this.dateval));
    }

    public set value(value:Date)
    {
        this.dateval = value;
        this.stringval = DateField.format(value,this.format);
        this.element$.value = this.stringval;
    }


    public static parse(str:string, format:string, defval:Date) : Date
    {
        return(new Date());
    }


    public static format(date:Date, format:string) : string
    {
        let parts:any[] = [];

        if (date == null || (""+date).length == 0)
            return(null);

        parts.push({part: "d", pos: format.indexOf("dd"), value: date.getDate()});
        parts.push({part: "m", pos: format.indexOf("mm"), value: date.getMonth()+1});
        parts.push({part: "y", pos: format.indexOf("yyyy"), value: date.getUTCFullYear()});

        parts[0].value = (""+parts[0].value).padStart(2,"0");
        parts[1].value = (""+parts[1].value).padStart(2,"0");
        parts[2].value = (""+parts[2].value).padStart(4,"0");

        parts.sort((a,b) => a.pos - b.pos);

        let str = parts[0].value + "-" + parts[1].value + "-" + parts[2].value;
        return(str);
    }
}