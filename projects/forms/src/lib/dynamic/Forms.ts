import { Form } from "./Form";
import { Builder } from "./Builder";
import { FormsDefinition } from "../FormsDefinition";
import { ApplicationRef, ComponentRef, EmbeddedViewRef } from '@angular/core';


interface Definition
{
    url?:string;
    name:string;
    title:string;
    component:any;
    navigable?:boolean;
    ref?:ComponentRef<any>;
}


export class Forms
{
    private form:Form;
    private stack:Definition[] = [];
    private forms:Definition[] = [];

    constructor(private app:ApplicationRef, private builder:Builder)
    {
    }

    public setForm(form:Form) : void
    {
        console.log("setForm");
        this.form = form;
    }

    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        for(let i=0; i < forms.length; i++)
        {
            let navigable:boolean = true;
            let form:FormsDefinition = forms[i];
            let url:string = form.name.toLowerCase();
            if (form.hasOwnProperty("url")) url = form.url;
            if (form.hasOwnProperty("navigable")) navigable = form.navigable;

            let def:Definition =
            {
                url: url,
                name: form.name,
                title: form.title,
                component: form.component,
                navigable: navigable
            };

            this.forms[form.name.toLowerCase()] = def;
        }
    }

    public async showform(form:string)
    {
        let i:number = 0;
        while(this.form == null && ++i < 10)
        setTimeout(function() {console.log("Waiting form form")}, 10);

        let def:Definition = this.forms[form.toLowerCase()];
        if (def != null && def.ref == null) def.ref = this.builder.createComponent(def.component);

        this.app.attachView(def.ref.hostView);
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        let formsarea:HTMLElement = await this.form.getFormsArea();

        if (this.stack.length > 0)
        {
            let last:Definition = this.stack[this.stack.length-1];
            let prev:HTMLElement = (last.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            formsarea.removeChild(prev);
        }

        formsarea.appendChild(element);
    }
}