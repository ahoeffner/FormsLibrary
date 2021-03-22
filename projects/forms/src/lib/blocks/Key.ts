import { NameValuePair } from "../utils/NameValuePair";

export class Key
{
    private values:NameValuePair[] = [];
    private index:Map<string,any> = new Map<string,any>();

    constructor(public name:string) {}

    public get(part:string|number) : any
    {
        if (part.constructor.name == "String")
            return(this.index.get(""+part));

        return(this.values[part as number]);
    }

    public set(name:string, value:any) : void
    {
        let nvp:NameValuePair = this.index.get(name);
        if (nvp != null) nvp.value = value;
    }

    public add(name:string, value?:any) : void
    {
        this.index.set(name,value);
        this.values.push({name: name, value: value});
    }

    public get columns() : NameValuePair[]
    {
        return(this.values);
    }
}