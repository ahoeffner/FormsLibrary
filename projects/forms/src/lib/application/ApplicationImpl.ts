import { Utils } from "../utils/Utils";
import { Parameters } from "./Parameters";
import { Builder } from "../utils/Builder";
import { FormArea } from "../forms/FormArea";
import { FormsControl } from "../forms/FormsControl";
import { FormInstance } from '../forms/FormsDefinition';
import { FormsDefinition, ModalOptions } from "../forms/FormsDefinition";


export class ApplicationImpl
{
    private title:string = null;
    private ready:boolean = false;
    private formsctl:FormsControl;
    private utils:Utils = new Utils();
    private params:Map<string,Parameters> = new Map<string,Parameters>();


    constructor(public builder:Builder)
    {
        this.formsctl = new FormsControl(this,builder);
    }


    public getTitle() : string
    {
        return(this.title);
    }


    public setTitle(title:string)
    {
        this.title = title;
        document.title = this.title;
    }


    public getFormsControl() : FormsControl
    {
        return(this.formsctl);
    }


    public getParameters(component:any) : Parameters
    {
        if (component == null) return(null);

        let name:string = this.utils.getName(component);
        let params:Parameters = this.params.get(name);

        if (params == null)
        {
            params = new Parameters();
            this.params.set(name,params);
        }

        return(params);
    }


    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.formsctl.setFormsDefinitions(forms);
        let form:string = window.location.pathname;

        if (form.length > 1)
        {
            let name:string = this.formsctl.findFormByPath(form);
            if (name == null) return;

            let params:Parameters = this.getParameters(name);
            let urlparams = new URLSearchParams(window.location.search);
            urlparams.forEach((value,key) => {params.set(key,value)});

            this.showform(name);
        }
    }


    public getFormsList() : FormInstance[]
    {
        return(this.formsctl.getFormsList());
    }


    public getFormsDefinitions() : Map<string,FormInstance>
    {
        return(this.formsctl.getFormsDefinitions());
    }


    public setFormArea(form:FormArea)
    {
        this.formsctl.setFormArea(form);
        this.ready = true;
    }


    public newform(form:any, modal?:ModalOptions)
    {
        if (this.ready) this.formsctl.showform(form,false,modal);
        else setTimeout(() => {this.newform(form);},10);
    }


    public showform(form:any, modal?:ModalOptions)
    {
        if (this.ready) this.formsctl.showform(form,false,modal);
        else setTimeout(() => {this.showform(form);},10);
    }


    public closeform(form:any, destroy:boolean)
    {
        if (this.ready) this.formsctl.closeform(form,destroy);
        else setTimeout(() => {this.closeform(form,destroy);},10);
    }


    public getFormInstance(form:any, modal?:ModalOptions) : FormInstance
    {
        return(this.formsctl.getFormInstance(form,modal));
    }
}