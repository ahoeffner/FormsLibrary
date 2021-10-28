import { TextField } from './TextField';

export class CheckBox extends TextField
{
    private actvalue:any = null;
    private chkvalue:any = null;

    public get html() : string
    {
        return("<input type='checkbox'></input>");
    }

    public get value() : any
    {
        return(this.actvalue);
    }

    public set value(value:any)
    {
        if (this.chkvalue == null)
        {
            this.chkvalue = value;
            return;
        }

        this.actvalue = value;

        // cheat compiler
        let checkbox:any = this.element;

        if (value == this.chkvalue) checkbox.checked = true;
        else                        checkbox.checked = false;
    }
}