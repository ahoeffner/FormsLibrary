import { Input } from './Input';

export class Password extends Input
{
    public get html() : string
    {
        return("<input type='password'></input>");
    }
}