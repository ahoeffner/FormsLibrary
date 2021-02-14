import { Builder } from "../utils/Builder";
import { Injectable } from '@angular/core';
import { ApplicationImpl } from "./ApplicationImpl";
import { FormsDefinition } from "../forms/FormsDefinition";


@Injectable({
    providedIn: 'root',
  })


export class Application
{
    private impl:ApplicationImpl;


    constructor(builder:Builder)
    {
        this.impl = new ApplicationImpl(builder);
    }

    private getProtected() : ApplicationImpl
    {
        return(this.impl);
    }

    public setFormsDefinitions(forms:FormsDefinition[]) : void
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

    public showform(form:any, parameters?:Map<string,any>)
    {
        this.impl.showform(form,parameters);
    }
}