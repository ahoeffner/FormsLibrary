import { FormImpl } from "../forms/FormImpl";
import { Menu } from "../menu/Menu";
import { ComponentRef } from "@angular/core";
import { DropDownMenu } from "../menu/DropDownMenu";


export class ApplicationState
{
    public menus:Menu[] = [];
    public form:FormImpl = null;
    public currentmenu:ComponentRef<DropDownMenu> = null;
    public defaultmenu:ComponentRef<DropDownMenu> = null;


    public async connect(usr?:string, pwd?:string) : Promise<boolean>
    {
        for(let i = 0; i < this.menus.length; i++)
            this.menus[i].getHandler().onConnect();

        return(true);
    }


    public async disconnect() : Promise<boolean>
    {
        for(let i = 0; i < this.menus.length; i++)
            this.menus[i].getHandler().onDisconnect();

        return(true);
    }
}