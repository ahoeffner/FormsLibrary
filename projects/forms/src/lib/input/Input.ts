import { FieldType } from "./FieldType";

export class Input implements FieldType
{
    public html:string;

    constructor()
    {
        this.html = "<input></input>";
    }
}