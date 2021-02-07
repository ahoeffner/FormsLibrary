import { Builder } from "./dynamic/Builder";
import { FormsDefinition } from "./FormsDefinition";
import { ApplicationImpl } from "./ApplicationImpl";
import { Injectable, ApplicationRef } from '@angular/core';


@Injectable({
    providedIn: 'root',
  })


export class Application
{
    private title$:string;
    private impl:ApplicationImpl;


    constructor(aref:ApplicationRef, builder:Builder)
    {
        this.impl = new ApplicationImpl(aref,builder);
    }

    private getImplementation() : ApplicationImpl
    {
        return(this.impl);
    }

    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.impl.setFormsDefinitions(forms);
    }

    public get title() : string
    {
        return(this.title$);
    }

    public set title(title:string)
    {
        this.title$ = title;
        document.title = this.title$;
    }

    public async showform(form:string)
    {
        this.impl.showform(form);
    }
}