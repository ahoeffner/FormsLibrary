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
    // impl is read and title is modified by impl behind the scenes


    constructor(builder:Builder)
    {
        this.impl = new ApplicationImpl(this,builder);
    }

    public get title() : string
    {
        return(this.title$);
    }

    public set title(title:string)
    {
        this.impl.setTitle(title);
    }

    public setMenu(menu:Menu) : void
    {
        this.impl.setMenu(menu);
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