import { Builder } from "../utils/Builder";
import { FormList } from "../menu/FormList";
import { FormArea } from "../forms/FormArea";
import { InstanceID } from "../forms/InstanceID";
import { FormInstance } from '../forms/FormInstance';
import { FormsControl } from "../forms/FormsControl";
import { WindowOptions } from "../forms/WindowOptions";
import { InstanceControl } from "../forms/InstanceControl";
import { FormDefinition } from "../forms/FormsDefinition";


export class ApplicationImpl
{
    private title:string = null;
    private ready:boolean = false;
    private formsctl:FormsControl;
    private formlist:FormList = null;
    private instances:InstanceControl;


    constructor(public builder:Builder)
    {
        this.formsctl = new FormsControl(this,builder);
        this.instances = new InstanceControl(this.formsctl);
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


    public setFormsDefinitions(forms:FormDefinition[]) : void
    {
        let formsmap:Map<string,FormInstance> =
            this.formsctl.setFormsDefinitions(forms);

        this.instances.setFormsDefinitions(formsmap);
        let form:string = window.location.pathname;

        if (form.length > 1)
        {
            let name:string = this.formsctl.findFormByPath(form);
            if (name == null) return;

            let params:Map<string,any> = new Map<string,any>();
            let urlparams = new URLSearchParams(window.location.search);
            urlparams.forEach((value,key) => {params.set(key,value)});

            this.showform(name,params);
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


    public setFormList(formlist:FormList) : void
    {
        this.formlist = formlist;
    }


    public setFormArea(form:FormArea) : void
    {
        this.formsctl.setFormArea(form);
        this.ready = true;
    }


    public newform(form:any, parameters:Map<string,any>) : void
    {
        let formdef:FormInstance = null;
        if (this.ready) formdef = this.formsctl.showform(form,true,parameters);
        else setTimeout(() => {this.newform(form,parameters);},10);

        if (this.formlist != null && formdef != null)
            this.formlist.open(formdef.path);
    }


    public showform(form:any, parameters?:Map<string,any>) : void
    {
        let formdef:FormInstance = null;
        if (this.ready) formdef = this.formsctl.showform(form,false,parameters);
        else setTimeout(() => {this.showform(form,parameters);},10);

        if (this.formlist != null && formdef != null)
            this.formlist.open(formdef.path);
    }


    public showinstance(inst:FormInstance, parameters:Map<string,any>) : void
    {
        if (this.ready) this.formsctl.display(inst,parameters);
        else setTimeout(() => {this.showinstance(inst,parameters);},10);
    }


    public closeform(form:any, destroy:boolean) : void
    {
        if (this.ready) this.formsctl.closeform(form,destroy);
        else setTimeout(() => {this.closeform(form,destroy);},10);
    }


    public getFormInstance(form:any) : FormInstance
    {
        return(this.formsctl.getFormInstance(form));
    }


    public getNewInstance(form:any, modal?:WindowOptions) : InstanceID
    {
        return(this.instances.getNewInstance(form,modal));
    }


    public getInstance(id:InstanceID) : FormInstance
    {
        return(this.instances.getInstance(id));
    }


    public closeInstance(id:InstanceID, destroy:boolean) : void
    {
        this.instances.closeInstance(id,destroy);
    }
}