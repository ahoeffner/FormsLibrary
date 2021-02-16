import { FormImpl } from "./FormImpl";
import { Component, AfterViewInit } from '@angular/core';
import { BlockDefinition } from "../blocks/BlockDefinition";
import { BlockDefinitions } from "../blocks/BlockUsage";


export interface CallBack
{
    (form:Form) : void;
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
        this.impl.setCallback(func);
    }

    public ngAfterViewInit(): void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks;

        for (let i = 0; i < blocks.length; i++)
        {
            console.log("this: "+this.constructor.name);
            console.log("form: "+blocks[i].form.constructor.name);
            console.log("this == form ? "+(this == blocks[i].form));
            console.log("get1 ="+this["_getProtected"]);
            console.log("get2 ="+blocks[i].form["_getProtected"]);

            let vname:string = blocks[i].vname;
            let block = this["emp"];
            console.log(vname+" xxblock="+block);
        }
    }
}