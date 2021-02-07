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
    private url:string;
    private current:HTMLElement;
    private forms:Definition[] = [];

    constructor(private app:ApplicationRef, private builder:Builder)
    {
        this.url = window.location.protocol + '//' + window.location.host;
    }

    public setForm(form:Form) : void
    {
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

    public showform(form:string)
    {
        let def:Definition = this.forms[form.toLowerCase()];
        if (def != null && def.ref == null) def.ref = this.builder.createComponent(def.component);

        if (this.form == null)
        {
            window.alert("showform cannot be called before form-component is initialized");
            return;
        }

        let formsarea:HTMLElement = this.form.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        if (formsarea == null)
        {
            window.alert("showform cannot be called before form-component is initialized");
            return;
        }

        let state = {additionalInformation: 'None'};
        window.history.replaceState(state,def.name,this.url+"/"+def.url);

        if (this.current != null) formsarea.removeChild(this.current);
        this.current = element;

        this.app.attachView(def.ref.hostView);
        formsarea.appendChild(element);
    }
}