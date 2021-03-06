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
    // dont rename impl as it is read behind the scenes

    constructor()
    {
        this.impl = new FormImpl(this);
    }

    public get name() : string
    {
        return(this.constructor.name);
    }

    public set Title(title:string)
    {
        this.impl.title = title;
    }

    public get Title() : string
    {
        return(this.impl.title);
    }

    public set Menu(menu:Menu)
    {
        this.impl.setMenu(menu);
    }

    public get Menu()
    {
        return(this.impl.getMenu());
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
        this.impl.callForm(form,false,parameters);
    }

    public getCallStack() : Form[]
    {
        return(this.impl.getCallStack());
    }

    public clearCallStack() : void
    {
        this.impl.clearStack();
    }

    public get Parameters() : Map<string,any>
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
        this.impl.getApplication().dropContainer();
        this.impl.newForm(container);
    }
}