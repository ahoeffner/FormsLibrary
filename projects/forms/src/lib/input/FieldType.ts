import { Input } from "./Input";
import { Password } from "./Password";


export class FieldTypes
{
    private static types:Map<string,any> = null;

    private static init() : void
    {
        if (FieldTypes.types != null) return;
        FieldTypes.types = new Map<string,any>();

        FieldTypes.types.set("input",Input);
        FieldTypes.types.set("password",Password);
    }

    public static getClass(type:string) : any
    {
        FieldTypes.init();
        return(FieldTypes.types.get(type.toLowerCase()));
    }
}


export interface FieldType
{
    html:string;
    enabled:boolean;
    element:HTMLElement;

    getValue() : any;
    setValue(value:any) : void;
    enable(flag:boolean) : void;
}