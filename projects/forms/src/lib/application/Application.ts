import { Menu } from "../menu/Menu";
import { Builder } from "../utils/Builder";
import { Injectable } from '@angular/core';
import { Preferences } from "./Preferences";
import { FormImpl } from "../forms/FormImpl";
import { ApplicationImpl } from "./ApplicationImpl";


@Injectable({
    providedIn: 'root',
})

export class Application
{
    private title$:string;
    private impl:ApplicationImpl;
    // dont rename impl as it is read behind the scenes


    constructor(builder:Builder)
    {
        this.impl = new ApplicationImpl(this,builder);
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

    public get preferences() : Preferences
    {
        return(new Preferences());
    }

    public closeform(destroy?:boolean) : void
    {
        if (destroy == undefined) destroy = false;
        let form:FormImpl = this.impl.appstate.form;
        if (form != null) form.close(destroy);
    }

    public connect(usr?:string, pwd?:string) : void
    {
        this.impl.appstate.connect(usr,pwd);
    }

    public disconnect() : void
    {
        this.impl.appstate.disconnect();
    }
}