import { FormImpl } from "./FormImpl";
import { BlockProperty } from "../blocks/BlockProperty";
import { Definitions } from "../Directives/Definitions";
import { Component, AfterViewInit } from '@angular/core';


export interface CallBack
{
    (form:Form, cancel:boolean) : void;
}


@Component({template: ''})

export class Form implements AfterViewInit
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

    public start() : void
    {
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

    public ngAfterViewInit(): void
    {
        let blocks:BlockProperty[] = Definitions.getBlocks(this.constructor.name);
        if (blocks == null) return;

        for (let i = 0; i < blocks.length; i++)
        {
            let block = this[blocks[i].prop];
        }
    }
}