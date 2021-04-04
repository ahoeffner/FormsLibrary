import { FieldInterface } from "./FieldType";


export class TextField implements FieldInterface
{
    public element$:HTMLInputElement;


    public get html() : string
    {
        return("<input></input>");
    }

    public set size(size:number)
    {
        this.element$.size = size;
    }

    public get tabindex() : number
    {
        return(this.element$.tabIndex);
    }

    public get element() : HTMLElement
    {
        return(this.element$);
    }

    public set tabindex(seq:number)
    {
        this.element$.tabIndex = seq;
    }

    public set element(element:HTMLElement)
    {
        this.element$ = element as HTMLInputElement;
    }

    public set enable(flag:boolean)
    {
        this.element$.disabled = !flag;
    }

    public set readonly(flag:boolean)
    {
        this.element$.readOnly = flag;
    }

    public get value() : any
    {
        return(this.element$.value);
    }

    public set value(value:any)
    {
        this.element$.value = value;
    }
}