import { DropDownMenu } from "./DropDownMenu";

export class MenuInterface
{
    private menu:DropDownMenu;

    constructor(menu:DropDownMenu)
    {
        this.menu = menu;
    }

    public enable(menu?:string)
    {
        this.menu.enable(menu);
    }

    public disable(menu?:string)
    {
        this.menu.disable(menu);
    }
}