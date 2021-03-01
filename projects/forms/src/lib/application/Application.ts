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
    private _title:string;
    private impl:ApplicationImpl;


    constructor(builder:Builder)
    {
        this.impl = new ApplicationImpl(this,builder);
        Reflect.defineProperty(this,"_getProtected", {value: () => {return(this.impl)}});
        Reflect.defineProperty(this,"_setTitle", {value: (title:string) => {this._title = title;}});
    }

    public get title() : string
    {
        return(this._title);
    }

    public set title(title:string)
    {
        this.impl.setTitle(title);
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