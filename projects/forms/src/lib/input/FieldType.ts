import { Input } from "./Input";
import { Password } from "./Password";


export class FieldType
{
    public static date:FieldType = new FieldType("date");
    public static input:FieldType = new FieldType("input");
    public static number:FieldType = new FieldType("number");
    public static decimal:FieldType = new FieldType("decimal");
    public static datetime:FieldType = new FieldType("datetime");
    public static password:FieldType = new FieldType("password");

    private constructor(public name:string) {};
}


export class FieldImplementation
{
    private static impl:Map<string,any> = null;

    private static init() : void
    {
        if (FieldImplementation.impl != null) return;
        FieldImplementation.impl = new Map<string,any>();

        FieldImplementation.impl.set("date",Input);
        FieldImplementation.impl.set("input",Input);
        FieldImplementation.impl.set("number",Input);
        FieldImplementation.impl.set("decimal",Input);
        FieldImplementation.impl.set("datetime",Input);
        FieldImplementation.impl.set("password",Password);
    }

    public static getClass(type:string) : any
    {
        FieldImplementation.init();
        return(FieldImplementation.impl.get(type.toLowerCase()));
    }

    public static guess(type:string) : FieldType
    {
        let ftype:FieldType = FieldType.input;

        if (type != null)
        {
            type = type.toLowerCase();

            if (type.indexOf("int")) ftype = FieldType.number;
            if (type.indexOf("float")) ftype = FieldType.decimal;
            if (type.indexOf("number")) ftype = FieldType.number;
            if (type.indexOf("numeric")) ftype = FieldType.decimal;
            if (type.indexOf("decimal")) ftype = FieldType.decimal;
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