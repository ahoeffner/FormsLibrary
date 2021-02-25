import { Menu } from "../menu/Menu";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { DropDownMenu } from "../menu/DropDownMenu";
import { Connection } from "../database/Connection";


export class ApplicationState
{
    public menus:Menu[] = [];
    public form:FormImpl = null;
    public connection:Connection;
    public currentmenu:ComponentRef<DropDownMenu> = null;
    public defaultmenu:ComponentRef<DropDownMenu> = null;

    private conn:boolean = false;


    constructor()
    {
        this.connection = new Connection();
    }


    public async connect(usr?:string, pwd?:string) : Promise<boolean>
    {
        this.conn = true;
        this.connection.connect(usr,pwd);

        for(let i = 0; i < this.menus.length; i++)
            this.menus[i].getHandler().onConnect();

        return(true);
    }


    public async disconnect() : Promise<boolean>
    {
        this.conn = false;

        for(let i = 0; i < this.menus.length; i++)
            this.menus[i].getHandler().onDisconnect();

        return(true);
    }


    public connected() : boolean
    {
        return(this.conn);
    }
}