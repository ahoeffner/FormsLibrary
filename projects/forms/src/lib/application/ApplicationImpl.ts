import { Utils } from "../utils/Utils";
import { Parameters } from "./Parameters";
import { Builder } from "../utils/Builder";
import { FormArea } from "../forms/FormArea";
import { PopupControl } from "../popup/PopupControl";
import { FormsControl } from "../forms/FormsControl";
import { FormsDefinition } from "../forms/FormsDefinition";


export class ApplicationImpl
{
    private title:string = null;
    private ready:boolean = false;
    private formsctl:FormsControl;
    private params:Parameters[] = [];
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


    public getParameters(component:any) : Parameters
    {
        let name:string = this.utils.getName(component);
        let params:Parameters = this.params[name];

        if (params == null)
        {
            params = new Parameters();
            this.params[name] = params;
        }

        return(params);
    }


    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.formsctl.setFormsDefinitions(forms);
        let form:string = window.location.pathname;

        if (form.length > 1)
        {
            let name:string = form.substring(1);
            let params:Parameters = this.getParameters(name);
            let urlparams = new URLSearchParams(window.location.search);
            urlparams.forEach((value,key) => {params.set(key,value)});
            this.showform(name);
        }
    }


    public setFormArea(form:FormArea)
    {
        this.formsctl.setFormArea(form);
        this.ready = true;
    }


    public newform(form:any)
    {
        if (this.ready) this.formsctl.newform(form);
        else setTimeout(() => {this.newform(form);},10);
    }


    public showform(form:any)
    {
        if (this.ready) this.formsctl.showform(form);
        else setTimeout(() => {this.showform(form);},10);
    }


    public callform(form:any)
    {
        if (this.ready) this.formsctl.callform(form);
        else setTimeout(() => {this.callform(form);},10);
    }


    public closeform(form:any, destroy:boolean)
    {
        if (this.ready) this.formsctl.closeform(form,destroy);
        else setTimeout(() => {this.closeform(form,destroy);},10);
    }


    public showpopup(popup:any) : void
    {
        let ctrl:PopupControl = new PopupControl(this,popup);
        ctrl.display();
    }
}