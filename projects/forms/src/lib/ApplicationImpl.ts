import { Form } from "./dynamic/Form";
import { Forms } from "./dynamic/Forms";
import { Builder } from "./dynamic/Builder";
import { ApplicationRef } from '@angular/core';
import { FormsDefinition } from "./FormsDefinition";


export class ApplicationImpl
{
    private forms:Forms;


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
    }


    public async showform(form:string)
    {
        this.forms.showform(form);
    }
}