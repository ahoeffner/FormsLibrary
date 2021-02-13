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
        this.display(form,this.getModalOptions(form,modal));
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
            def.ref = null;
        }
    }


    private display(form:any, modal:ModalOptions) : void
    {
        let name:string = this.utils.getName(form);
        let def:FormInstance = this.forms.get(name);

        if (def == null) return;

        if (def.ref == null)
        {
            def.ref = this.builder.createComponent(def.component);

            if (!(def.ref.instance instanceof Form))
            {
                let name:string = def.ref.instance.constructor.name;
                window.alert("Component "+name+" is not an instance of Form");
                return;
            }
        }

        let impl:FormImpl = Protected.get<FormImpl>(def.ref.instance);
        impl.setApplication(this.app);

        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (def.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        document.title = def.title;
        let state = {additionalInformation: 'None'};
        window.history.replaceState(state,def.name,this.url+def.path);

        if (modal == null)
        {
            if (this.current != null)
            {
                formsarea.removeChild(this.current.element);
                this.builder.getAppRef().detachView(def.ref.hostView);
            }

            this.current = {formdef: def, element: element};
            this.builder.getAppRef().attachView(def.ref.hostView);

            formsarea.appendChild(element);
        }
        else
        {
            let appref = this.app.builder.getAppRef();
            let winref = this.app.builder.createComponent(ModalWindow);

            let win:ModalWindow = winref.instance;

            impl.setModal(win);
            win.setForm(def,modal);

            let element:HTMLElement = (winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

            appref.attachView(winref.hostView);
            document.body.appendChild(element);
        }
    }


    private getModalOptions(form:any, options:ModalOptions) : ModalOptions
    {
        let optutil:Options = new Options();
        let name:string = this.utils.getName(form);
        let formdef:FormInstance = this.forms.get(name);

        if (formdef == null) return(null);
        if (options == null) options = formdef.modal;
        else options = optutil.override(options,formdef.modal);

        return(options);
    }
}