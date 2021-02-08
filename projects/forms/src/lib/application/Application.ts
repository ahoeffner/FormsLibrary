import { Popup } from "../popup/Popup";
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
        return(this.impl.getTitle());
    }

    public set title(title:string)
    {
        this.impl.setTitle(title);
    }

    public showform(form:string)
    {
        this.impl.showform(form);
    }

    public callform(form:string)
    {
        this.impl.callform(form);
    }

    public closeform(form:string)
    {
        this.impl.closeform(form);
    }

    public showpopup(popup:Popup) : void
    {
        this.impl.showpopup(popup);
    }
}