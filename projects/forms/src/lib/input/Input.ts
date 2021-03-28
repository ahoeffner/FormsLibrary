import { FieldInterface } from "./FieldType";


export class Input implements FieldInterface
{
    private enabled$:boolean;
    public element$:HTMLInputElement;


    public get html() : string
    {
        return("<input></input>");
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
        this.enable = false;
    }

    public set enable(flag:boolean)
    {
        this.enabled$ = flag;
        this.element$.disabled = !flag;
        if (!flag) this.element$.readOnly = true;
    }

    public set rdonly(flag:boolean)
    {
        this.element$.readOnly = flag;
    }

    public get enable() : boolean
    {
        return(this.enabled$);
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