import { Menu } from "../menu/Menu";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { MessageBox } from "../popup/MessageBox";
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
    public transaction:boolean = false;
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
        if (menu != null)
        {
            let mhdl:MenuHandler = menu.getHandler();
            this.menus.delete(mhdl.guid);
        }
    }


    public async clearAllForms()
    {
        this.forms.forEach((form) => {form.clear()});
    }


    public async onConnect() : Promise<boolean>
    {
        this.menus.forEach((mhdl) => {mhdl.onConnect()});

        this.forms.forEach(async (form) =>
        {
            let funcs:string[] = FormDefinitions.getOnConnect(form.name);
            for(let i = 0; i < funcs.length; i++) await this.app.execfunc(form,funcs[i]);
        });

        return(true);
    }


    public transactionChange(trans:boolean) : void
    {
        if (trans+"" != this.transaction+"")
        {
            this.transaction = trans;
            this.menus.forEach((mhdl) => {mhdl.onTransactionChange()});
        }
    }


    public async onDisconnect() : Promise<boolean>
    {
        this.menus.forEach((mhdl) => {mhdl.onDisconnect()});

        this.forms.forEach(async (form) =>
        {
            let funcs:string[] = FormDefinitions.getOnDisconnect(form.name);
            for(let i = 0; i < funcs.length; i++) await this.app.execfunc(form,funcs[i]);
        });

        return(true);
    }


    public get connected() : boolean
    {
        return(this.connection.connected);
    }


    public alert(message:string, title?:string, width?:string, height?:string) : void
    {
        MessageBox.show(this.app,message,title,width,height);
    }
}