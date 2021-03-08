import { FieldType } from "./FieldType";

export class Password implements FieldType
{
    public html:string;

    constructor()
    {
        this.html = "<input type='password'></input>";
    }
}