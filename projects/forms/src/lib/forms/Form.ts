import { Menu } from "../menu/Menu";
import { FormImpl } from "./FormImpl";
import { Component, AfterViewInit } from '@angular/core';
import { BlockDefinitions } from "../annotations/BlockDefinitions";


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

    public init() : void
    {
    }

    public start() : void
    {
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

    public ngAfterViewInit(): void
    {
        let blocks:any[] = BlockDefinitions.getBlocks(this.constructor.name);
        if (blocks == null) return;

        for (let i = 0; i < blocks.length; i++)
        {
            let block = this[blocks[i].prop];
            let alias = this[blocks[i].alias];
        }
    }
}