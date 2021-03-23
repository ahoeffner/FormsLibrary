import { Menu } from "../menu/Menu";
import { FormImpl } from "./FormImpl";
import { Listener } from "../events/Listener";
import { Container } from "../container/Container";
import { Component, AfterViewInit, OnInit } from "@angular/core";


export interface CallBack
{
    (form:Form, cancel:boolean) : void;
}


@Component({template: ''})


export class Form implements OnInit, AfterViewInit
{
    private _impl_:FormImpl;
    // dont rename impl as it is read behind the scenes

    constructor()
    {
        this._impl_ = new FormImpl(this);
    }

    public get name() : string
    {
        return(this.constructor.name);
    }

    public set Title(title:string)
    {
        this._impl_.title = title;
    }

    public get Title() : string
    {
        return(this._impl_.title);
    }

    public set Menu(menu:Menu)
    {
        this._impl_.setMenu(menu);
    }

    public get Menu()
    {
        return(this._impl_.getMenu());
    }

    public newform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.showform(form,true,parameters);
    }

    public showform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.showform(form,false,parameters);
    }

    public callform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.callform(form,false,parameters);
    }

    public getCallStack() : Form[]
    {
        return(this._impl_.getCallStack());
    }

    public clearCallStack() : void
    {
        this._impl_.clearStack();
    }

    public get Parameters() : Map<string,any>
    {
        return(this._impl_.getParameters());
    }

    public wasCancelled() : boolean
    {
        return(this._impl_.wasCancelled());
    }

    public close(dismiss?:boolean) : void
    {
        this._impl_.close(dismiss);
    }

    public setCallback(func:CallBack) : void
    {
        this._impl_.setCallback(func);
    }

    public addListener(listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        this._impl_.addListener(this,listener,types,keys);
    }

    public ngOnInit()
    {
        this._impl_.getApplication().setContainer();
    }

    public ngAfterViewInit(): void
    {

        let container:Container = this._impl_.getApplication().getContainer();
        this._impl_.getApplication().dropContainer();
        this._impl_.newForm(container);
    }
}