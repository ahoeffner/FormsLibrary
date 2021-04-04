import { Password } from "./Password";
import { TextField } from "./TextField";
import { DateField } from "./DateField";


export enum FieldType
{
    date,
    text,
    integer,
    decimal,
    datetime,
    password
}


export class FieldImplementation
{
    private static impl:Map<string,any> = null;

    private static init() : void
    {
        if (FieldImplementation.impl != null) return;
        FieldImplementation.impl = new Map<string,any>();

        Object.keys(FieldType).forEach((type) =>
        {
            if (isNaN(Number(type)))
                FieldImplementation.impl.set(type,TextField);
        });

        FieldImplementation.impl.set(FieldType[FieldType.date],DateField)
        FieldImplementation.impl.set(FieldType[FieldType.password],Password)
    }

    public static getClass(type:string) : any
    {
        FieldImplementation.init();
        return(FieldImplementation.impl.get(type));
    }

    public static guess(type:string) : FieldType
    {
        let ftype:FieldType = FieldType.text;

        if (type != null)
        {
            type = type.toLowerCase();

            if (type.indexOf("date")      >= 0) ftype = FieldType.date;
            if (type.indexOf("int")       >= 0) ftype = FieldType.integer;
            if (type.indexOf("float")     >= 0) ftype = FieldType.decimal;
            if (type.indexOf("number")    >= 0) ftype = FieldType.integer;
            if (type.indexOf("numeric")   >= 0) ftype = FieldType.decimal;
            if (type.indexOf("decimal")   >= 0) ftype = FieldType.decimal;
            if (type.indexOf("datetime")  >= 0) ftype = FieldType.datetime;
            if (type.indexOf("timestamp") >= 0) ftype = FieldType.datetime;
        }

        return(ftype);
    }
}


export interface FieldInterface
{
    value:any;
    html:string;
    size:number;
    enable:boolean;
    tabindex:number;
    readonly:boolean;
    element:HTMLElement;
}