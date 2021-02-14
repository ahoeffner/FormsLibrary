import { Utils } from "../utils/Utils";
import { Builder } from "../utils/Builder";
import { FormArea } from "../forms/FormArea";
import { FormsControl } from "../forms/FormsControl";
import { FormInstance } from '../forms/FormsDefinition';
import { FormsDefinition, ModalOptions, InstanceID } from "../forms/FormsDefinition";


export class ApplicationImpl
{
    private title:string = null;
    private ready:boolean = false;
    private formsctl:FormsControl;
    private utils:Utils = new Utils();


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


    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.formsctl.setFormsDefinitions(forms);
        let form:string = window.location.pathname;

        if (form.length > 1)
        {
            let name:string = this.formsctl.findFormByPath(form);
            if (name == null) return;

            let params:Map<string,any> = new Map<string,any>();
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


    public newform(form:any)
    {
        if (this.ready) this.formsctl.showform(form,false);
        else setTimeout(() => {this.newform(form);},10);
    }


    public showinstance(inst:FormInstance)
    {
        if (this.ready) this.formsctl.display(inst);
        else setTimeout(() => {this.showinstance(inst);},10);
    }


    public showform(form:any)
    {
        if (this.ready) this.formsctl.showform(form,false);
        else setTimeout(() => {this.showform(form);},10);
    }


    public closeform(form:any, destroy:boolean)
    {
        if (this.ready) this.formsctl.closeform(form,destroy);
        else setTimeout(() => {this.closeform(form,destroy);},10);
    }


    public getFormInstance(form:any, modal?:ModalOptions) : FormInstance
    {
        return(this.formsctl.getFormInstance(form));
    }


    public getNewInstance(form:any, modal?:ModalOptions) : InstanceID
    {
        return(this.formsctl.getNewInstance(form,modal));
    }


    public getInstance(id:InstanceID) : FormInstance
    {
        return(this.formsctl.getInstance(id));
    }


    public closeInstance<C>(id:InstanceID, destroy:boolean) : C
    {
        return(this.formsctl.closeInstance<C>(id,destroy));
    }
}