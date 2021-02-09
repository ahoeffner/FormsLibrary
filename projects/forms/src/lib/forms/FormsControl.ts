import { Form } from "./Form";
import { FormImpl } from "./FormImpl";
import { FormArea } from "./FormArea";
import { Builder } from "../utils/Builder";
import { Protected } from '../utils/Protected';
import { FormsDefinition } from "./FormsDefinition";
import { ComponentRef, EmbeddedViewRef } from '@angular/core';
import { ApplicationImpl } from "../application/ApplicationImpl";


interface Definition
{
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
            let fname:string = this.getName(form.component);
            if (form.hasOwnProperty("navigable")) navigable = form.navigable;

            let def:Definition =
            {
                name: fname,
                title: form.title,
                component: form.component,
                navigable: navigable
            };

            this.forms[fname] = def;
        }
    }


    public newform(form:any) : void
    {
        this.display(form,false,true);
    }


    public callform(form:any) : void
    {
        this.display(form,true,true);
    }


    public showform(form:any) : void
    {
        this.display(form,false,false);
    }


    public closeform(form:any, destroy:boolean) : void
    {
        let name:string = this.getName(form);
        let def:Definition = this.forms[name];

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

    private display(form:any, call:boolean, close:boolean) : void
    {
        let name:string = this.getName(form);
        let def:Definition = this.forms[name];

        if (def == null) return;
        if (!call && !def.navigable) return;
        if (close) this.closeform(form,true);

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
        }


        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        let state = {additionalInformation: 'None'};
        window.history.replaceState(state,def.name,this.url+"/"+def.name);

        if (this.current != null)
        {
            formsarea.removeChild(this.current);
            this.builder.getAppRef().detachView(def.ref.hostView);
        }

        this.current = element;
        this.builder.getAppRef().attachView(def.ref.hostView);

        formsarea.appendChild(element);
    }


    private getName(component:any)
    {
        let name:string = component.constructor.name;

        if (name == "String") name = component;
        if (name == "Function") name = component.name;

        return(name.toLowerCase());
    }
}