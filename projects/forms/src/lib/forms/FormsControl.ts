import { Form } from "./Form";
import { FormUtil } from "./FormUtil";
import { FormImpl } from "./FormImpl";
import { FormArea } from "./FormArea";
import { Utils } from "../utils/Utils";
import { InstanceID } from "./InstanceID";
import { Builder } from "../utils/Builder";
import { ModalWindow } from "./ModalWindow";
import { FormInstance } from "./FormInstance";
import { Protected } from '../utils/Protected';
import { FormDefinition } from "./FormsDefinition";
import { EmbeddedViewRef, ComponentRef } from '@angular/core';
import { ApplicationImpl } from "../application/ApplicationImpl";


interface Current
{
    formdef:FormInstance,
    element:HTMLElement
}


export class FormsControl
{
    private current:Current;
    private formarea:FormArea;
    private utils:Utils = new Utils();
    private formlist:FormInstance[] = [];
    private forms:Map<string,FormInstance> = new Map<string,FormInstance>();

    constructor(private app:ApplicationImpl, private builder:Builder) {}


    public setFormArea(formarea:FormArea) : void
    {
        this.formarea = formarea;
    }


    public setFormsDefinitions(forms:FormDefinition[]) : Map<string,FormInstance>
    {
        let futil:FormUtil = new FormUtil();

        for(let i=0; i < forms.length; i++)
        {
            let form:FormDefinition = forms[i];
            let def:FormInstance = futil.convert(form);

            this.formlist.push(def);
            this.forms.set(def.name,def);
        }

        return(this.forms);
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


    public closeform(form:any, destroy:boolean) : void
    {
        let name:string = this.utils.getName(form);
        let formdef:FormInstance = this.forms.get(name);

        if (formdef == null || formdef.formref == null) return;
        this.close(formdef,destroy);
    }


    public close(formdef:FormInstance, destroy:boolean) : void
    {
        if (formdef.formref == null) return;
        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (formdef.formref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        if (this.current != null && this.current.element == element)
        {
            this.current = null;
            formsarea.removeChild(element);
            this.builder.getAppRef().detachView(formdef.formref.hostView);
        }

        if (destroy)
        {
            formdef.formref.destroy();
            formdef.windowopts = null;
            formdef.formref = null;
        }
    }


    public display(formdef:FormInstance, parameters:Map<string,any>) : void
    {
        if (formdef == null || formdef.formref == null) return;
        let formsarea:HTMLElement = this.formarea.getFormsArea();
        let element:HTMLElement = (formdef.formref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        let impl:FormImpl = Protected.get(formdef.formref.instance);

        impl.setPath(formdef.path);
        impl.setTitle(formdef.title);
		impl.setParameters(parameters);

        if (formdef.windowopts == null)
        {
            this.current = {formdef: formdef, element: element};
            this.builder.getAppRef().attachView(formdef.formref.hostView);

            formsarea.appendChild(element);
        }
        else
        {
            let id:InstanceID =
            {
                impl: impl,
                ref: formdef.formref,
                name: formdef.name,
                modalopts: formdef.windowopts
            }

            impl.setInstanceID(id);
            let win:ModalWindow = this.createWindow();

            win.setForm(formdef);
            win.setApplication(this.app);
        }

        impl.onStart();
    }


    public createWindow() : ModalWindow
    {
        let winref:ComponentRef<any> = this.app.builder.createComponent(ModalWindow);
        let win:ModalWindow = winref.instance;

        win.setWinRef(winref);

        let element:HTMLElement = (winref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.builder.getAppRef().attachView(winref.hostView);

        document.body.appendChild(element);
        return(win);
    }


    public getFormInstance(form:any) : FormInstance
    {
        let name:string = this.utils.getName(form);
        let formdef:FormInstance = this.forms.get(name);
        if (formdef == null) return(null);

        if (formdef.formref == null)
        {
            formdef.formref = this.createForm(formdef.component);

            if (formdef.windowdef != null && formdef.windowdef.modal)
                formdef.windowopts = formdef.windowdef;
        }

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
        impl.onInit();

        return(ref);
    }
}