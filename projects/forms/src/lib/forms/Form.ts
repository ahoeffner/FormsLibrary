import { FormImpl } from "./FormImpl";
import { Component, AfterViewInit } from '@angular/core';
import { BlockDefinition } from '../blocks/BlockDefinition';


export interface CallBack
{
    (form:Form) : void;
}


@Component({template: ''})

export class Form implements AfterViewInit
{
    private impl:FormImpl;
    private callbackfunc:CallBack;
    private vname:string;

    constructor()
    {
        this.impl = new FormImpl(this);

        Reflect.defineProperty(this,"_getProtected", {value: () =>
        {
            return(this.impl);
        }});

        Reflect.defineProperty(this,"_callback", {value: (form:any) =>
        {
            if (this.callbackfunc == null) return;
            this[this.callbackfunc.name](form);
        }});
    }

    public setBlockDefinition(blocks:BlockDefinition[]) : void
    {
        this.impl.setBlockDefinition(blocks);
    }

    public callForm(form:any, parameters?:Map<string,any>) : void
    {
        this.impl.callForm(form,parameters);
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
        this.callbackfunc = func;
    }

    public ngAfterViewInit(): void
    {
        let block:any = this[this.vname];
        console.log("ngAfterViewInit block="+block.constructor.name);
    }


    public setBlock(vname:string, alias:string)
    {
        this.vname = vname;
    }
}