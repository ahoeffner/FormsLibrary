import { Theme } from "./Themes";
import { Config } from "./Config";
import { Menu } from "../menu/Menu";
import { Builder } from "../utils/Builder";
import { Injectable } from '@angular/core';
import { FormImpl } from "../forms/FormImpl";
import { HttpClient } from "@angular/common/http";
import { LoginForm } from "../database/LoginForm";
import { ApplicationImpl } from "./ApplicationImpl";
import { PopupInstance } from "../popup/PopupInstance";


@Injectable({
    providedIn: 'root',
})

export class Application
{
    private title$:string;
    private impl:ApplicationImpl;
    // dont rename impl as it is read behind the scenes


    constructor(private conf:Config, client:HttpClient, builder:Builder)
    {
        this.impl = new ApplicationImpl(conf,this,client,builder);
    }

    public get Title() : string
    {
        return(this.title$);
    }

    public set Title(title:string)
    {
        this.title$ = title;
        this.impl.setTitle(title);
    }

    public get AppOrFormTitle() : string
    {
        return(this.impl.getCurrentTitle());
    }

    public set Menu(menu:Menu)
    {
        this.impl.setMenu(menu);
    }

    public get Menu() : Menu
    {
        return(this.impl.getMenu());
    }

    public newform(form:any, parameters?:Map<string,any>)
    {
        this.impl.showform(form,true,parameters);
    }

    public showform(form:any, parameters?:Map<string,any>)
    {
        this.impl.showform(form,false,parameters);
    }

    public callform(form:any, parameters?:Map<string,any>)
    {
        this.impl.callform(form,false,parameters);
    }

    public get colors() : Theme
    {
        return(this.conf.colors);
    }

    public closeform(destroy?:boolean) : void
    {
        if (destroy == undefined) destroy = false;
        let form:FormImpl = this.impl.appstate.form;
        if (form != null) form.close(destroy);
    }

    public connect() : void
    {
        if (!this.impl.appstate.connected)
        {
            let pinst:PopupInstance = new PopupInstance();
            pinst.display(this.impl,LoginForm);
        }
    }

    public disconnect() : void
    {
        if (this.impl.appstate.connected)
            this.impl.appstate.connection.disconnect();
    }
}