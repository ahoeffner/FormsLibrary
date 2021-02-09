import { Form } from "./Form";
import { FormImpl } from "./FormImpl";
import { FormArea } from "./FormArea";
import { Builder } from "../utils/Builder";
import { Protected } from '../utils/Protected';
import { FormsDefinition } from "./FormsDefinition";
import { Parameters } from "../application/Parameters";
import { ComponentRef, EmbeddedViewRef } from '@angular/core';
import { ApplicationImpl } from "../application/ApplicationImpl";


interface Definition
{
    url?:string;
    name:string;
    title:string;
    component:any;
    navigable?:boolean;
    ref?:ComponentRef<any>;
}


export class FormsControl
{
    private url:string;
    private formarea:FormArea;
    private current:HTMLElement;
    private forms:Definition[] = [];


    constructor(private app:ApplicationImpl, private builder:Builder)
    {
        this.url = window.location.protocol + '//' + window.location.host;
    }


    public setFormArea(formarea:FormArea) : void
    {
        this.formarea = formarea;
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


    public callform(form:string, params:Parameters) : void
    {
        this.display(form,true,params);
    }


    public showform(form:string, params:Parameters) : void
    {
        this.display(form,false,params);
    }


    public closeform(form:string, destroy:boolean) : void
    {
        let def:Definition = this.forms[form.toLowerCase()];

        if (def == null || def.ref == null) return;
        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        if (element == this.current)
        {
            this.current = null;
            formsarea.removeChild(element);
            this.builder.getAppRef().detachView(def.ref.hostView);
        }

        if (destroy)
        {
            def.ref.destroy();
            def.ref = null;
        }
    }

    private display(form:string, call:boolean, params:Parameters) : void
    {
        let def:Definition = this.forms[form.toLowerCase()];

        if (def == null) return;
        if (!call && !def.navigable) return;
        if (call) this.closeform(form,true);

        if (def.ref == null)
        {
            def.ref = this.builder.createComponent(def.component);

            if (!(def.ref.instance instanceof Form))
            {
                let name:string = def.ref.instance.constructor.name;
                window.alert("Component "+name+" is not an instance of Form");
                return;
            }

            let impl:FormImpl = Protected.get<FormImpl>(def.ref.instance);

            impl.setApp(this.app);
            impl.setParams(params);
        }


        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        let state = {additionalInformation: 'None'};
        window.history.replaceState(state,def.name,this.url+"/"+def.url);

        if (this.current != null)
        {
            formsarea.removeChild(this.current);
            this.builder.getAppRef().detachView(def.ref.hostView);
        }

        this.current = element;
        this.builder.getAppRef().attachView(def.ref.hostView);

        formsarea.appendChild(element);
    }
}