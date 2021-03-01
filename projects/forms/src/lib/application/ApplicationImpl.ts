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
import { Container } from "../container/Container";
import { DropDownMenu } from "../menu/DropDownMenu";
import { FormInstance } from '../forms/FormInstance';
import { FormsControl } from "../forms/FormsControl";
import { ApplicationState } from "./ApplicationState";
import { WindowOptions } from "../forms/WindowOptions";
import { FormDefinition } from "../forms/FormsDefinition";
import { InstanceControl } from "../forms/InstanceControl";
import { FormDefinitions } from "../annotations/FormDefinitions";
import { ContainerControl } from "../container/ContainerControl";


export class ApplicationImpl
{
    private title:string = null;
    private atitle:string = null;
    private marea:MenuArea = null;
    private ready:boolean = false;
    private formlist:FormList = null;
    private mfactory:MenuFactory = null;
    private formsctl:FormsControl = null;
    private state:ApplicationState = null;
    private contctl:ContainerControl = null;
    private instances:InstanceControl = null;


    constructor(private app:Application, public builder:Builder)
    {
        this.state = new ApplicationState();
        this.contctl = new ContainerControl(builder);
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
        this.atitle = title;
        this.showTitle(title);
    }


    public close() : void
    {
        this.closeform(this.state.form,true);
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
        if (title == null)
            title = this.atitle;

        this.title = title;
        document.title = title;
        this.app["_setTitle"](title);
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


    public setContainer(container?:Container) : void
    {
        this.contctl.setContainer(container);
    }


    public getContainer() : Container
    {
        return(this.contctl.getContainer());
    }


    public newForm(impl:FormImpl) : void
    {
        console.log("Newform: "+impl.name);
    }


    public preform(impl:FormImpl, parameters:Map<string,any>, formdef:FormInstance, path:boolean) : void
    {
        console.log("Preform: "+impl.name);
        if (!impl.initiated())
        {
            impl.path = formdef.path;
            impl.title = formdef.title;
            impl.initiated(true);
        }

        impl.setParameters(parameters);
        this.showTitle(impl.title);
        if (path) this.showPath(impl.name,impl.path);
    }


    public postform(impl:FormImpl, destroy:boolean) : void
    {
        console.log("Postform: "+impl.name+" destroy: "+destroy);
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

            this.closeform(this.state.form,false);
        }

        if (destroy) this.formsctl.closeform(form,destroy);
        let formdef:FormInstance = this.getFormInstance(form);

        if (formdef == null) return;
        let impl:FormImpl = Protected.get(formdef.formref.instance);

        this.state.form = impl;
        this.preform(impl,parameters,formdef,true);
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

        this.formsctl.display(formdef);

        if (this.formlist != null)
            this.formlist.open(formdef.path);
    }


    public showinstance(inst:FormInstance) : void
    {
        if (this.ready) this.formsctl.display(inst);
        else setTimeout(() => {this.showinstance(inst);},10);
    }


    public closeform(impl:FormImpl, destroy:boolean) : void
    {
        if (impl == null) return;
        this.postform(impl,destroy);
        this.formsctl.closeform(impl.name,destroy);
        DropDownMenu.setForm(this.state.currentmenu,null);
        this.showPath("","");
        this.showTitle(null);
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
        this.postform(id.impl,destroy);
        this.instances.closeInstance(id,destroy);
    }


    private showMenu(menu:ComponentRef<DropDownMenu>) : void
    {
        if (this.marea != null)
            this.marea.display(menu);
    }


    public createmenu(menu:Menu) : ComponentRef<DropDownMenu>
    {
        this.state.addMenu(menu);
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