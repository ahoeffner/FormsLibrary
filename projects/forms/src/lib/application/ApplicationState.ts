import { Menu } from "../menu/Menu";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { MenuHandler } from "../menu/MenuHandler";
import { DefaultMenu } from "../menu/DefaultMenu";
import { Connection } from "../database/Connection";
import { DropDownMenu } from "../menu/DropDownMenu";
import { ApplicationImpl } from "./ApplicationImpl";
import { FormDefinitions } from "../annotations/FormDefinitions";


export class ApplicationState
{
    public menu:Menu = null;
    public form:FormImpl = null;
    public connection:Connection;
    public appmenu:ComponentRef<DropDownMenu> = null;
    public forms:Map<number,FormImpl> = new Map<number,FormImpl>();
    public menus:Map<number,MenuHandler> = new Map<number,MenuHandler>();


    constructor(private app:ApplicationImpl)
    {
        this.menu = new DefaultMenu();
        this.connection = new Connection(app);
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


    public async onConnect() : Promise<boolean>
    {
        this.menus.forEach((mhdl) => {mhdl.onConnect()});

        this.forms.forEach((form) =>
        {
            let funcs:string[] = FormDefinitions.getOnConnect(form.name);
            for(let i = 0; i < funcs.length; i++) this.app.execfunc(form,funcs[i]);
        });

        return(true);
    }


    public async onDisconnect() : Promise<boolean>
    {
        this.menus.forEach((mhdl) => {mhdl.onDisconnect()});

        this.forms.forEach((form) =>
        {
            let funcs:string[] = FormDefinitions.getOnDisconnect(form.name);
            for(let i = 0; i < funcs.length; i++) this.app.execfunc(form,funcs[i]);
        });

        return(true);
    }


    public get connected() : boolean
    {
        return(this.connection.connected);
    }
}