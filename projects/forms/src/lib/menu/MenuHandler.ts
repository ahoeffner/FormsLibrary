import { Form } from '../forms/Form';
import { MenuInterface } from "./MenuInterface";

export abstract class MenuHandler
{
    public ready:boolean = false;
    public menu:MenuInterface = null;

    constructor()
    {
        Reflect.defineProperty(this,"_setProtected", {value: (intf:MenuInterface) =>
        {
            this.menu = intf;
            this.ready = true;
        }});
    }

    abstract activate() : void;
    abstract setForm(form:Form) : void;
}