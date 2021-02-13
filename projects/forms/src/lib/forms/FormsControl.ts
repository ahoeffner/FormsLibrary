import { Form } from "./Form";
import { FormImpl } from "./FormImpl";
import { FormArea } from "./FormArea";
import { Utils } from "../utils/Utils";
import { Builder } from "../utils/Builder";
import { ModalWindow } from "./ModalWindow";
import { Protected } from '../utils/Protected';
import { EmbeddedViewRef, ComponentRef } from '@angular/core';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FormsDefinition, FormInstance, Options, ModalOptions } from "./FormsDefinition";


interface Current
{
    formdef:FormInstance,
    element:HTMLElement
}


export class FormsControl
{
    private url:string;
    private current:Current;
    private formarea:FormArea;
    private utils:Utils = new Utils();
    private formlist:FormInstance[] = [];
    private forms:Map<string,FormInstance> = new Map<string,FormInstance>();


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
        let options:Options = new Options();

        for(let i=0; i < forms.length; i++)
        {
            let form:FormsDefinition = forms[i];
            let def:FormInstance = options.convert(form);

            this.formlist.push(def);
            this.forms.set(def.name,def);
        }
    }


    public findFormByPath(path:string) : string
    {
        for(let i = 0; i < this.formlist.length; i++)
        {
            if (this.formlist[i].path == path)
                return(this.formlist[i].name);
        }

        return(null);
    }


    public getFormsList() : FormInstance[]
    {
        return(this.formlist);
    }


    public getFormsDefinitions() : Map<string,FormInstance>
    {
        return(this.forms);
    }


    public showform(form:any, newform:boolean, modal:ModalOptions) : void
    {
        if (newform) this.closeform(form,true);
        this.display(form,modal);
    }


    public closeform(form:any, destroy:boolean) : void
    {
        let name:string = this.utils.getName(form);
        let def:FormInstance = this.forms.get(name);

        if (def == null || def.ref == null) return;
        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        if (this.current != null && this.current.element == element)
        {
            this.current = null;
            formsarea.removeChild(element);
            this.builder.getAppRef().detachView(def.ref.hostView);
        }

        if (destroy)
        {
            def.ref.destroy();
            def.modalopts = null;
            def.ref = null;
        }
    }


    private display(form:any, modal:ModalOptions) : void
    {
        let formdef:FormInstance = this.getFormInstance(form,modal);
        if (formdef == null) return;

        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (formdef.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        document.title = formdef.title;

        let state = {additionalInformation: 'None'};
        window.history.replaceState(state,formdef.name,this.url+formdef.path);

        if (formdef.modalopts == null)
        {
            if (this.current != null)
            {
                formsarea.removeChild(this.current.element);
                this.builder.getAppRef().detachView(formdef.ref.hostView);
            }

            this.current = {formdef: formdef, element: element};
            this.builder.getAppRef().attachView(formdef.ref.hostView);

            formsarea.appendChild(element);
        }
        else
        {
            let winref:ComponentRef<any> = this.app.builder.createComponent(ModalWindow);
            let win:ModalWindow = winref.instance;

            win.setWinRef(winref);
            win.setApplication(this.app);
            win.setForm(formdef);

            let element:HTMLElement = (winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            this.builder.getAppRef().attachView(winref.hostView);

            document.body.appendChild(element);
        }
    }


    public getFormInstance(form:any, modal?:ModalOptions) : FormInstance
    {
        let name:string = this.utils.getName(form);
        let formdef:FormInstance = this.forms.get(name);
        if (formdef == null) return(null);

        if (formdef.ref == null)
        {
            formdef.ref = this.builder.createComponent(formdef.component);

            if (!(formdef.ref.instance instanceof Form))
            {
                let name:string = formdef.ref.instance.constructor.name;
                window.alert("Component "+name+" is not an instance of Form");
                return;
            }

            let impl:FormImpl = Protected.get<FormImpl>(formdef.ref.instance);
            impl.setApplication(this.app);
        }

        let optutil:Options = new Options();
        formdef.modalopts = optutil.override(modal,formdef.modaldef);

        return(formdef);
    }
}