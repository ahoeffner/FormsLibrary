import { Menu } from "../menu/Menu";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { MenuHandler } from "../menu/MenuHandler";
import { DefaultMenu } from "../menu/DefaultMenu";
import { Connection } from "../database/Connection";
import { DropDownMenu } from "../menu/DropDownMenu";
import { ApplicationImpl } from "./ApplicationImpl";


export class ApplicationState
{
    public menu:Menu = null;
    public form:FormImpl = null;
    public connection:Connection;
    public appmenu:ComponentRef<DropDownMenu> = null;
    public forms:Map<number,FormImpl> = new Map<number,FormImpl>();
    public menus:Map<number,MenuHandler> = new Map<number,MenuHandler>();

    private conn:boolean = false;


    constructor(private app:ApplicationImpl)
    {
        this.menu = new DefaultMenu();
        this.connection = new Connection();
    }


    public addForm(form:FormImpl) : void
    {
        this.forms.set(form.guid,form);
    }


    public dropForm(form:FormImpl) : void
    {
        this.forms.delete(form.guid);
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