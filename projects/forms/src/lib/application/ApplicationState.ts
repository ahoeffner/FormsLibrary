import { Menu } from "../menu/Menu";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { DropDownMenu } from "../menu/DropDownMenu";
import { Connection } from "../database/Connection";
import { MenuHandler } from "../menu/MenuHandler";


export class ApplicationState
{
    public form:FormImpl = null;
    public connection:Connection;
    public currentmenu:ComponentRef<DropDownMenu> = null;
    public defaultmenu:ComponentRef<DropDownMenu> = null;
    public menus:Map<string,MenuHandler> = new Map<string,MenuHandler>();

    private conn:boolean = false;


    constructor()
    {
        this.connection = new Connection();
    }


    public addMenu(menu:Menu) : void
    {
        let mhdl:MenuHandler = menu.getHandler();
        this.menus.set(mhdl.guid,mhdl);
    }


    public dropMenu(menu:Menu) : void
    {
        let mhdl:MenuHandler = menu.getHandler();
        this.menus.delete(mhdl.guid);
    }


    public async connect(usr?:string, pwd?:string) : Promise<boolean>
    {
        this.conn = true;
        this.connection.connect(usr,pwd);
        this.menus.forEach((mhdl) => {mhdl.onConnect()});
        return(true);
    }


    public async disconnect() : Promise<boolean>
    {
        this.conn = false;
        this.menus.forEach((mhdl) => {mhdl.onDisconnect()});
        return(true);
    }


    public connected() : boolean
    {
        return(this.conn);
    }
}