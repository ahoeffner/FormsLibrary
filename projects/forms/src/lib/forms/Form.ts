import { Menu } from "../menu/Menu";
import { FormImpl } from "./FormImpl";
import { Container } from "../container/Container";
import { Component, AfterViewInit, OnInit } from "@angular/core";


export interface CallBack
{
    (form:Form, cancel:boolean) : void;
}


@Component({template: ''})


export class Form implements OnInit, AfterViewInit
{
    private impl:FormImpl;

    constructor()
    {
        this.impl = new FormImpl(this);

        Reflect.defineProperty(this,"_getProtected", {value: () =>
        {
            return(this.impl);
        }});
    }

    public get name() : string
    {
        return(this.constructor.name);
    }

    public setTitle(title:string) : void
    {
        this.impl.title = title;
    }

    public setMenu(menu:Menu)
    {
        this.impl.setMenu(menu);
    }

    public newform(form:any, parameters?:Map<string,any>) : void
    {
        this.impl.showform(form,true,parameters);
    }

    public showform(form:any, parameters?:Map<string,any>) : void
    {
        this.impl.showform(form,false,parameters);
    }

    public callform(form:any, parameters?:Map<string,any>) : void
    {
        this.impl.callForm(form,false,false,parameters);
    }

    public getCallStack() : Form[]
    {
        return(this.impl.getCallStack());
    }

    public clearStack() : void
    {
        this.impl.clearStack();
    }

    public getParameters() : Map<string,any>
    {
        return(this.impl.getParameters());
    }

    public wasCancelled() : boolean
    {
        return(this.impl.wasCancelled());
    }

    public close(dismiss?:boolean) : void
    {
        this.impl.close(dismiss);
    }

    public setCallback(func:CallBack) : void
    {
        this.impl.setCallback(func);
    }

    public ngOnInit()
    {
        this.impl.getApplication().setContainer();
    }

    public ngAfterViewInit(): void
    {
        let container:Container = this.impl.getApplication().getContainer();
        this.impl.newForm(container);
    }
}