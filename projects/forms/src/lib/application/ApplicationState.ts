import { FormImpl } from "../forms/FormImpl";
import { Menu } from "../menu/Menu";
import { ComponentRef } from "@angular/core";
import { DropDownMenu } from "../menu/DropDownMenu";


export class ApplicationState
{
    public menu:Menu;
    public defmenu:Menu;
    public form:FormImpl = null;
    public currentmenu:ComponentRef<DropDownMenu> = null;
    public defaultmenu:ComponentRef<DropDownMenu> = null;


    public async connect() : Promise<boolean>
    {
        return(true);
    }


    public async disconnect() : Promise<boolean>
    {
        return(true);
    }
}