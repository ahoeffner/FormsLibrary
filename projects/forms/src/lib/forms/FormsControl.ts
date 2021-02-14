import { Form } from "./Form";
import { FormImpl } from "./FormImpl";
import { FormArea } from "./FormArea";
import { Utils } from "../utils/Utils";
import { Builder } from "../utils/Builder";
import { ModalWindow } from "./ModalWindow";
import { Protected } from '../utils/Protected';
import { FormsInstance } from "./FormsInstance";
import { EmbeddedViewRef, ComponentRef } from '@angular/core';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FormsDefinition, FormInstance, FormUtil, ModalOptions, InstanceID } from "./FormsDefinition";


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
    private instances:FormsInstance;
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
        let futil:FormUtil = new FormUtil();

        for(let i=0; i < forms.length; i++)
        {
            let form:FormsDefinition = forms[i];
            let def:FormInstance = futil.convert(form);

            this.formlist.push(def);
            this.forms.set(def.name,def);
        }

        this.instances = new FormsInstance(this.app, this.forms);
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
        this.displayform(form,modal);
    }


    public getNewInstance(form:any, modal?:ModalOptions) : InstanceID
    {
        return(this.instances.getNewInstance(form,modal));
    }


    public getInstance(id:InstanceID) : FormInstance
    {
        return(this.instances.getInstance(id));
    }


    public closeInstance<C>(id:InstanceID, destroy:boolean) : C
    {
        return(this.instances.closeInstance<C>(id,destroy));
    }


    public closeform(form:any, destroy:boolean) : void
    {
        let name:string = this.utils.getName(form);
        let formdef:FormInstance = this.forms.get(name);

        if (formdef == null || formdef.ref == null) return;
        this.close(formdef,destroy);
    }


    public close(formdef:FormInstance, destroy:boolean) : void
    {
        if (formdef.ref == null) return;
        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (formdef.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        if (this.current != null && this.current.element == element)
        {
            this.current = null;
            formsarea.removeChild(element);
            this.builder.getAppRef().detachView(formdef.ref.hostView);
        }

        if (destroy)
        {
            formdef.ref.destroy();
            formdef.modalopts = null;
            formdef.ref = null;
        }
    }


    private displayform(form:any, modal:ModalOptions) : void
    {
        let formdef:FormInstance = this.getFormInstance(form,modal);
        this.display(formdef);
    }


    public display(formdef:FormInstance) : void
    {
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
            formdef.ref = this.createForm(formdef.component);

        let optutil:FormUtil = new FormUtil();
        formdef.modalopts = optutil.override(modal,formdef.modaldef);

        return(formdef);
    }


    public createForm(component:any) : ComponentRef<any>
    {
        let ref:ComponentRef<any> = this.builder.createComponent(component);

        if (!(ref.instance instanceof Form))
        {
            let name:string = ref.instance.constructor.name;
            window.alert("Component "+name+" is not an instance of Form");
            return;
        }

        let impl:FormImpl = Protected.get<FormImpl>(ref.instance);
        impl.setApplication(this.app);

        return(ref);
    }
}