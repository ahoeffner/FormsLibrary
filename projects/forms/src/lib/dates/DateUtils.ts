import { dates } from "./dates";

export class DateUtils
{
    public parse(datestr:string, format?:string) : Date
    {
        return(dates.parse(datestr,format));
    }

    public format(date:Date, format?:string) : string
    {
        return(dates.format(date,format));
    }
}