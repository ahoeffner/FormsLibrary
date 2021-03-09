import { FieldType } from "./FieldType";


export class Input implements FieldType
{
    public element$:HTMLInputElement;


    public get html() : string
    {
        return("<input></input>");
    }

    public set element(element:HTMLElement)
    {
        this.element$ = element as HTMLInputElement;
        this.enable(false);
    }

    public enable(flag:boolean) : void
    {
        if (!flag) this.element$.disabled = true;
        else       this.element$.disabled = false;
    }

    public getValue() : string
    {
        return(this.element$.value);
    }

    public setValue(value:any) : void
    {
        this.element$.value = value;
    }
}