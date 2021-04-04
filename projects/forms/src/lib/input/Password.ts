import { TextField } from './TextField';

export class Password extends TextField
{
    public get html() : string
    {
        return("<input type='password'></input>");
    }
}