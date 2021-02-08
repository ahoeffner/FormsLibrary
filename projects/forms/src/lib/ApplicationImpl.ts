import { Form } from "./dynamic/Form";
import { Popup } from "./dynamic/Popup";
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
        let form:string = window.location.pathname;
        if (form.length > 1) this.showform(form.substring(1));
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


    public callform(form:string)
    {
        if (this.ready) this.forms.callform(form);
        else setTimeout(() => {this.callform(form);},10);
    }


    public createPopup(component:any) : Popup
    {
        let popup:Popup = new Popup();
        return(popup);
    }
}