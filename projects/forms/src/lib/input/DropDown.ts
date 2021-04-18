import { TextField } from './TextField';

export class DropDown extends TextField
{
    public get html() : string
    {
        return("<select></select>");
    }
}