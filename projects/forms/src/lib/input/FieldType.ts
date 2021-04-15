import { Password } from "./Password";
import { TextField } from "./TextField";
import { DateField } from "./DateField";
import { Column } from "../database/Column";


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

    public static guess(type:Column) : FieldType
    {
        let ftype:FieldType = FieldType.text;

        if (type != null)
        {
            ftype = FieldType.text;
            if (type == Column.date) ftype = FieldType.date;
            if (type == Column.integer) ftype = FieldType.integer;
            if (type == Column.decimal) ftype = FieldType.decimal;
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

    focus() : void;
    validate() : boolean;
}