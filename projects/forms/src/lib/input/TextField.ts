import { FieldInterface } from "./FieldType";


export class TextField implements FieldInterface
{
    public element$:HTMLInputElement;


    public get html() : string
    {
        return("<input type='text'></input>");
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

    public get enable() : boolean
    {
        return(!this.element$.disabled);
    }

    public set enable(flag:boolean)
    {
        this.element$.disabled = !flag;
    }

    public get readonly() : boolean
    {
        return(this.element$.readOnly);
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

    public focus() : void
    {
        this.element$.focus();
        this.element$.select();
    }

    public validate() : boolean
    {
        return(true);
    }
}