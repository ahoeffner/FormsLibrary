import { FieldInterface } from './FieldType';

export class DisplayField implements FieldInterface
{
    public size:number = 0;
    public enable: boolean = false;
    public readonly: boolean = true;
    private element$:HTMLSpanElement;

    public get html() : string
    {
        return("<span></span>");
    }

    public get element() : HTMLElement
    {
        return(this.element$);
    }

    public set element(element:HTMLElement)
    {
        this.element$ = element as HTMLSpanElement;
    }

    public focus(): void 
    {
        this.element$.focus();
    }

    public get tabindex() : number
    {
        return(this.element$.tabIndex);
    }

    public set tabindex(seq:number)
    {
        this.element$.tabIndex = seq;
    }

    public validate(): boolean 
    {
        return(true);
    }

    public get value() : any
    {
        return(this.element$.textContent);
    }

    public set value(value:any)
    {
        this.element$.textContent = value;
    }
}