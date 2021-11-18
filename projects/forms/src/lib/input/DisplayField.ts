import { TextField } from './TextField';

export class DisplayField extends TextField
{
    public get html() : string
    {
        return("<span></span>");
    }

    public get value() : any
    {
        return(this.element.textContent);
    }

    public set value(value:any)
    {
        this.element.textContent = value;
    }
}