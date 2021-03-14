import { FieldType } from "./FieldType";


export class Input implements FieldType
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
        if (!flag) this.element$.disabled = true;
        else       this.element$.disabled = false;
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