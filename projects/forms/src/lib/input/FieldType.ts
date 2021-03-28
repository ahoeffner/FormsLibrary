import { Input } from "./Input";
import { Password } from "./Password";


export class FieldType
{
    public static input:FieldType = new FieldType("input");
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

        FieldImplementation.impl.set("input",Input);
        FieldImplementation.impl.set("password",Password);
    }

    public static getClass(type:string) : any
    {
        FieldImplementation.init();
        return(FieldImplementation.impl.get(type.toLowerCase()));
    }
}


export interface FieldInterface
{
    value:any;
    html:string;
    enable:boolean;
    rdonly:boolean;
    tabindex:number;
    element:HTMLElement;
}