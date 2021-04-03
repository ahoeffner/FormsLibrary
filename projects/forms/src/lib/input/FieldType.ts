import { Input } from "./Input";
import { Password } from "./Password";


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
                FieldImplementation.impl.set(type,Input);
        });

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

            if (type.indexOf("date")) ftype = FieldType.date;
            if (type.indexOf("int")) ftype = FieldType.integer;
            if (type.indexOf("float")) ftype = FieldType.decimal;
            if (type.indexOf("number")) ftype = FieldType.integer;
            if (type.indexOf("numeric")) ftype = FieldType.decimal;
            if (type.indexOf("decimal")) ftype = FieldType.decimal;
            if (type.indexOf("datetime")) ftype = FieldType.datetime;
            if (type.indexOf("timestamp")) ftype = FieldType.datetime;
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