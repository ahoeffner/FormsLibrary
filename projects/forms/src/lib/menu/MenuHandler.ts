import { MenuInterface } from "./MenuInterface";

export class MenuHandler
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
}