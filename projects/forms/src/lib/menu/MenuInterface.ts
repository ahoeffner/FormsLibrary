import { DropDownMenu } from "./DropDownMenu";
import { Protected } from "../utils/Protected";
import { Application } from "../application/Application";
import { ApplicationImpl } from "../application/ApplicationImpl";

export class MenuInterface
{
    private menu:DropDownMenu;
    private impl$:ApplicationImpl;


    constructor(menu:DropDownMenu)
    {
        this.menu = menu;
        this.impl$ = Protected.get<ApplicationImpl>(this.menu);
    }

    public get app() : Application
    {
        return(this.impl$.getApplication());
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