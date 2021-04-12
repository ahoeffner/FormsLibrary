import { NameValuePair } from "../utils/NameValuePair";

export class Key
{
    private values$:any[] = [];
    private columns$:string[] = [];
    private index:Map<string,any> = new Map<string,any>();

    constructor(public name:string) {}

    public get(part:string|number) : any
    {
        let col:number = -1;

        if (part.constructor.name == "Number") col = +part;
        else col = this.index.get(""+part);

        return(this.values$[col]);
    }

    public partof(part:string) : boolean
    {
        return(this.columns$.includes(part,0));
    }

    public set(name:string|number, value:any) : void
    {
        let col:number = -1;

        if (name.constructor.name == "Number") col = +name;
        else col = this.index.get(""+name);

        this.values$[col] = value;
    }

    public add(name:string) : void
    {
        this.index.set(name,this.columns$.length);

        this.values$.push(name);
        this.columns$.push(name);
    }

    public columns() : string[]
    {
        return(this.columns$);
    }

    public get values() : NameValuePair[]
    {
        let map:NameValuePair[] = [];

        for (let i = 0; i < this.columns$.length; i++)
        {
            let val:any = this.values$.length > i ? this.values$[i] : null;
            map.push({name: this.columns$[i], value: val});
        }

        return(map);
    }
}