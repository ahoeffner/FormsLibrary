import { Theme } from "./Themes";
import { Config } from "./Config";
import { Menu } from "../menu/Menu";
import { Context } from "./Context";
import { Form } from "../forms/Form";
import { Builder } from "../utils/Builder";
import { Injectable } from '@angular/core';
import { FormImpl } from "../forms/FormImpl";
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "../database/LoginForm";
import { ApplicationImpl } from "./ApplicationImpl";
import { PopupInstance } from "../popup/PopupInstance";
import { ListOfValuesImpl } from "../listval/ListOfValuesImpl";


@Injectable({
    providedIn: 'root',
})

export class Application
{
    private title$:string;
    private _impl_:ApplicationImpl;
    // dont rename impl as it is read behind the scenes


    constructor(ctx:Context, private conf:Config, client:HttpClient, builder:Builder)
    {
        ctx.app = this;
        ctx.conf = conf;
        this._impl_ = new ApplicationImpl(ctx,client,builder);
    }

    public get title() : string
    {
        return(this.title$);
    }

    public set title(title:string)
    {
        this.title$ = title;
        this._impl_.setTitle(title);
    }

    public get form() : Form
    {
        return(this._impl_.getCurrentForm()?.form);
    }

    public set menu(menu:Menu)
    {
        this._impl_.setMenu(menu);
    }

    public get menu() : Menu
    {
        return(this._impl_.getMenu());
    }

    public get transaction() : boolean
    {
        return(this._impl_.appstate.transaction);
    }

    public newform(form:any, parameters?:Map<string,any>)
    {
        this._impl_.showform(form,true,parameters);
    }

    public showform(form:any, parameters?:Map<string,any>)
    {
        this._impl_.showform(form,false,parameters);
    }

    public callform(form:any, parameters?:Map<string,any>)
    {
        this._impl_.callform(form,false,parameters);
    }

    public get colors() : Theme
    {
        return(this.conf.colors);
    }

    public set theme(theme:string)
    {
        setTimeout(() => {this.conf.setTheme(theme);},50);
    }

    public closeform(destroy?:boolean) : void
    {
        if (destroy == undefined) destroy = false;
        let form:FormImpl = this._impl_.getCurrentForm();
        if (form != null) form.close(destroy);
    }

    public connect() : void
    {
        if (!this._impl_.connected)
        {
            let pinst:PopupInstance = new PopupInstance();
            pinst.display(this._impl_,LoginForm);
        }
    }

    public cxxx() : void
    {
        if (!this._impl_.connected)
        {
            let pinst:PopupInstance = new PopupInstance();
            pinst.display(this._impl_,ListOfValuesImpl);
        }
    }

    public disconnect() : void
    {
        if (this._impl_.connected)
        {
            this._impl_.disconnect();
            this._impl_.getCurrentForm()?.clear();
        }
    }
}