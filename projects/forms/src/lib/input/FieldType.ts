import { DropDown } from "./DropDown";
import { Password } from "./Password";
import { CheckBox } from "./CheckBox";
import { TextField } from "./TextField";
import { DateField } from "./DateField";
import { RadioButton } from "./RadioButton";
import { Column } from "../database/Column";
import { DateTimeField } from "./DateTimeField";


export enum FieldType
{
    date,
    text,
    radio,
    integer,
    decimal,
    checkbox,
    datetime,
    password,
    dropdown
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

        FieldImplementation.impl.set(FieldType[FieldType.date],DateField);
        FieldImplementation.impl.set(FieldType[FieldType.radio],RadioButton);
        FieldImplementation.impl.set(FieldType[FieldType.checkbox],CheckBox);
        FieldImplementation.impl.set(FieldType[FieldType.password],Password);
        FieldImplementation.impl.set(FieldType[FieldType.dropdown],DropDown);
        FieldImplementation.impl.set(FieldType[FieldType.datetime],DateTimeField);
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
            if (type == Column.datetime) ftype = FieldType.datetime;
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