import { Form } from "./dynamic/Form";
import { Forms } from "./dynamic/Forms";
import { Builder } from "./dynamic/Builder";
import { ApplicationRef } from '@angular/core';
import { FormsDefinition } from "./FormsDefinition";


export class ApplicationImpl
{
    private forms:Forms;
    private ready:boolean = false;


    constructor(aref:ApplicationRef, builder:Builder)
    {
        this.forms = new Forms(aref,builder);
    }


    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.forms.setFormsDefinitions(forms);
    }


    public setForm(form:Form)
    {
        this.forms.setForm(form);
        this.ready = true;
    }


    public showform(form:string)
    {
        if (this.ready) this.forms.showform(form);
        else setTimeout(() => {this.showform(form);},10);
    }
}