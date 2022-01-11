import { TextField } from './TextField';

export class DropDown extends TextField
{
    enabled$:boolean = true;
    readonly$:boolean = true;


    public get html() : string
    {
        return("<select></select>");
    }

    public focus() : void
    {
        this.element$.focus();
    }

    public get enable() : boolean
    {
        return(this.enabled$);
    }

    public set enable(flag:boolean)
    {
        this.enabled$ = flag;
        if (flag) this.element$.removeAttribute("disabled");
        else     this.element$.setAttribute("disabled","disabled");
    }

    public get readonly() : boolean
    {
        return(this.readonly$);
    }

    public set readonly(flag:boolean)
    {
        this.readonly$ = flag;
        if (!flag) this.element$.removeAttribute("disabled");
        else       this.element$.setAttribute("disabled","disabled");
    }
}