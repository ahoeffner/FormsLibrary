import { DropDownMenu } from "./DropDownMenu";
import { Application } from "../application/Application";
import { ApplicationImpl } from "../application/ApplicationImpl";

export class MenuInterface
{
    private menu$:DropDownMenu;
    private app$:ApplicationImpl;


    constructor(menu:DropDownMenu)
    {
        this.menu$ = menu;
        this.app$ = this.menu$.getApplication()["_impl_"];
    }

    public get app() : Application
    {
        return(this.app$.getApplication());
    }

    public isConnected() : boolean
    {
        return(this.app$.appstate.connected);
    }

    public enable(menu?:string)
    {
        this.menu$.enable(menu);
    }

    public disable(menu?:string)
    {
        this.menu$.disable(menu);
    }
}