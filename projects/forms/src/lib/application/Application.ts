import { Builder } from "../utils/Builder";
import { Injectable } from '@angular/core';
import { ApplicationImpl } from "./ApplicationImpl";
import { FormDefinition } from "../forms/FormsDefinition";


@Injectable({
    providedIn: 'root',
  })


export class Application
{
    private impl:ApplicationImpl;


    constructor(builder:Builder)
    {
        this.impl = new ApplicationImpl(builder);
        Reflect.defineProperty(this,"_getProtected", {value: () => {return(this.impl)}});
    }

    public setFormsDefinitions(forms:FormDefinition[]) : void
    {
        this.impl.setFormsDefinitions(forms);
    }

    public get title() : string
    {
        return(this.impl.getTitle());
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
}