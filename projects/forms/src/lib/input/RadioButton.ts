import { TextField } from './TextField';

export class RadioButton extends TextField
{
    private actvalue:any = null;
    private chkvalue:any = null;

    public get html() : string
    {
        return("<input type='radio'></input>");
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
        let radio:any = this.element;

        if (value == this.chkvalue) radio.checked = true;
        else                        radio.checked = false;
    }
}