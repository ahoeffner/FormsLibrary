import { Menu } from "../menu/Menu";
import { Builder } from "../utils/Builder";
import { Application } from "./Application";
import { FormList } from "../menu/FormList";
import { MenuArea } from "../menu/MenuArea";
import { FormArea } from "../forms/FormArea";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { Protected } from "../utils/Protected";
import { InstanceID } from "../forms/InstanceID";
import { DefaultMenu } from "../menu/DefaultMenu";
import { MenuFactory } from "../menu/MenuFactory";
import { DropDownMenu } from "../menu/DropDownMenu";
import { FormInstance } from '../forms/FormInstance';
import { FormsControl } from "../forms/FormsControl";
import { ApplicationState } from "./ApplicationState";
import { WindowOptions } from "../forms/WindowOptions";
import { FormDefinition } from "../forms/FormsDefinition";
import { InstanceControl } from "../forms/InstanceControl";
import { FormDefinitions } from "../annotations/FormDefinitions";


export class ApplicationImpl
{
    private title:string = null;
    private marea:MenuArea = null;
    private ready:boolean = false;
    private formlist:FormList = null;
    private mfactory:MenuFactory = null;
    private formsctl:FormsControl = null;
    private state:ApplicationState = null;
    private instances:InstanceControl = null;


    constructor(private app:Application, public builder:Builder)
    {
        this.state = new ApplicationState();
        this.mfactory = new MenuFactory(this.builder);
        this.formsctl = new FormsControl(this,builder);
        this.instances = new InstanceControl(this.formsctl);
        this.setFormsDefinitions(FormDefinitions.getForms());
        this.state.defaultmenu = this.createmenu(new DefaultMenu());


    }


    public get appstate() : ApplicationState
    {
        return(this.state);
    }


    public getApplication() :Application
    {
        return(this.app);
    }


    public getTitle() : string
    {
        return(this.title);
    }


    public setTitle(title:string)
    {
        this.title = title;
        this.showTitle(title);
    }


    public close() : void
    {
        this.closeform(this.state.form.getForm(),true);
    }


    public setMenu(menu:Menu) : void
    {
        this.state.currentmenu = this.createmenu(menu);
        this.showMenu(this.state.currentmenu);
    }


    public setDefaultMenu(menu:Menu) : void
    {
        this.state.defaultmenu = this.createmenu(menu);
        this.showMenu(this.state.defaultmenu);
    }


    public showTitle(title:string) : void
    {
        if (title == null) title = this.title;
        document.title = title;
    }


    public showPath(name:string, path:string) : void
    {
        let state = {additionalInformation: 'None'};
        let url:string = window.location.protocol + '//' + window.location.host;
        window.history.replaceState(state,name,url+path);
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


    public setMenuArea(area:MenuArea) : void
    {
        this.marea = area;
        this.showMenu(this.state.defaultmenu);
    }


    public setFormArea(area:FormArea) : void
    {
        this.formsctl.setFormArea(area);
        this.ready = true;
    }


    public showform(form:any, destroy:boolean, parameters?:Map<string,any>) : void
    {
        if (!this.ready)
        {
            setTimeout(() => {this.showform(form,destroy,parameters);},10);
            return;
        }

        if (this.state.form != null)
        {
            if (this.state.form.getModalWindow() != null)
                return;

            this.closeform(this.state.form.getForm(),false);
        }

        if (destroy)
            this.closeform(form,true);

        let formdef:FormInstance = this.getFormInstance(form);

        if (formdef == null) return;
        let impl:FormImpl = Protected.get(formdef.formref.instance);

        this.state.form = impl;

        let fmenu:ComponentRef<DropDownMenu> = impl.getDropDownMenu();

        if (fmenu != null)
        {
            this.state.currentmenu = fmenu;
            DropDownMenu.setForm(this.state.currentmenu,formdef.formref.instance);

            if (formdef.windowdef == null || !formdef.windowdef.modal)
            {
                this.showMenu(this.state.currentmenu);
            }
            else
            {
                this.showMenu(this.state.defaultmenu);
            }
        }


        this.formsctl.display(formdef,parameters);

        if (this.formlist != null)
            this.formlist.open(formdef.path);
    }


    public showinstance(inst:FormInstance, parameters:Map<string,any>) : void
    {
        if (this.ready) this.formsctl.display(inst,parameters);
        else setTimeout(() => {this.showinstance(inst,parameters);},10);
    }


    public closeform(form:any, destroy:boolean) : void
    {
        if (form == null) return;
        this.formsctl.closeform(form,destroy);
        DropDownMenu.setForm(this.state.currentmenu,null);
        this.state.form = null;
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


    private showMenu(menu:ComponentRef<DropDownMenu>) : void
    {
        if (this.marea != null)
            this.marea.display(menu);
    }


    public createmenu(menu:Menu) : ComponentRef<DropDownMenu>
    {
        this.state.menus.push(menu);
        let ddmenu:ComponentRef<DropDownMenu> = this.mfactory.create(this,menu);
        return(ddmenu);
    }


    private setFormsDefinitions(forms:FormDefinition[]) : void
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
            this.showform(name,false,params);
        }
    }
}