import { Trace } from "./Trace";
import { Config } from "./Config";
import { Menu } from "../menu/Menu";
import { Context } from "./Context";
import { Wait } from "../utils/Wait";
import { Builder } from "../utils/Builder";
import { Application } from "./Application";
import { FormList } from "../menu/FormList";
import { MenuArea } from "../menu/MenuArea";
import { FormArea } from "../forms/FormArea";
import { FormImpl } from "../forms/FormImpl";
import { ComponentRef } from "@angular/core";
import { InstanceID } from "../forms/InstanceID";
import { HttpClient } from "@angular/common/http";
import { MenuFactory } from "../menu/MenuFactory";
import { Container } from "../container/Container";
import { DropDownMenu } from "../menu/DropDownMenu";
import { Connection } from "../database/Connection";
import { FormInstance } from '../forms/FormInstance';
import { FormsControl } from "../forms/FormsControl";
import { ApplicationState } from "./ApplicationState";
import { WindowOptions } from "../forms/WindowOptions";
import { Key, keymap, KeyMapper } from "../keymap/KeyMap";
import { FormDefinition } from "../forms/FormsDefinition";
import { WindowListener } from "../events/WindowListener";
import { InstanceControl } from "../forms/InstanceControl";
import { FormDefinitions } from "../annotations/FormDefinitions";
import { ContainerControl } from "../container/ContainerControl";
import { DatabaseDefinitions } from "../annotations/DatabaseDefinitions";
import { KeyTriggerEvent, Origin } from "../events/TriggerEvent";
import { Trigger } from "../events/Triggers";


export class ApplicationImpl
{
    private app:Application;
    private ready:number = 2;
    private config$:Config = null;
    private marea:MenuArea = null;
    private apptitle:string = null;
    private formlist:FormList = null;
    private mfactory:MenuFactory = null;
    private formsctl:FormsControl = null;
    private state:ApplicationState = null;
    private contctl:ContainerControl = null;
    private instances:InstanceControl = null;


    constructor(ctx:Context, public client:HttpClient, public builder:Builder)
    {
        this.app = ctx.app;
        this.config$ = ctx.conf;

        this.enable();
        this.loadConfig();

        this.state = new ApplicationState(this);
        this.contctl = new ContainerControl(builder);
        this.mfactory = new MenuFactory(this.builder);
        this.formsctl = new FormsControl(this,builder);
        this.instances = new InstanceControl(this.formsctl);
        this.setFormsDefinitions(FormDefinitions.getForms());
        this.state.appmenu = this.createmenu(this.state.menu);

        console.log("Version 3.14");
    }


    private async loadConfig()
    {
        await this.config$.ready();

        if (this.config$.others.hasOwnProperty("title"))
            this.setTitle(this.config$.others["title"]);

        if (this.config$.others.hasOwnProperty("theme"))
            this.config$.setTheme(this.config$.others["theme"]);

        this.ready--;
        this.showLinkedForm();
    }


    public get config() : Config
    {
        return(this.config$);
    }


    public enable() : void
    {
        WindowListener.add("app",this,"keydown");
    }


    public disable() : void
    {
        WindowListener.remove("app","keydown");
    }


    public get appstate() : ApplicationState
    {
        return(this.state);
    }


    public getApplication() :Application
    {
        return(this.app);
    }


    public setTitle(title:string)
    {
        this.apptitle = title;
        this.showTitle(title);
    }


    public close() : void
    {
        this.closeform(this.state.form,true);
    }


    public setMenu(menu:Menu) : void
    {
        this.deletemenu(this.state.menu);
        this.state.menu = menu;
        this.state.appmenu = this.createmenu(menu);
        this.showMenu(this.state.appmenu);
    }


    public getMenu() : Menu
    {
        return(this.state.menu);
    }


    public showTitle(title:string) : void
    {
        if (title == null) title = this.apptitle;
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
        this.showMenu(this.state.appmenu);
    }


    public setFormArea(area:FormArea) : void
    {
        this.formsctl.setFormArea(area);
        this.ready--;
    }


    public setContainer(container?:Container) : void
    {
        this.contctl.setContainer(container);
    }


    public getContainer() : Container
    {
        return(this.contctl.getContainer());
    }


    public dropContainer() : void
    {
        this.contctl.dropContainer();
    }


    public get connection() : Connection
    {
        return(this.appstate.connection);
    }


    public get connected() : boolean
    {
        return(this.appstate.connected);
    }


    public async disconnect() : Promise<void>
    {
        await this.appstate.connection.disconnect();
        this.getCurrentForm()?.focus();
    }


    public async newForm(impl:FormImpl)
    {
        let funcs:string[] = FormDefinitions.getOnInit(impl.name);
        for(let i = 0; i < funcs.length; i++)  await this.execfunc(impl,funcs[i]);

        funcs = FormDefinitions.getOnShow(impl.name);
        for(let i = 0; i < funcs.length; i++)  await this.execfunc(impl,funcs[i]);

        impl.onShow();
    }


    public async preform(impl:FormImpl, parameters:Map<string,any>, formdef:FormInstance, path:boolean)
    {
        impl.setParameters(parameters);

        if (!impl.initiated())
        {
            impl.path = formdef.path;
            impl.title = formdef.title;

            this.state.addForm(impl);
            this.showTitle(formdef.title);

            if (path) this.showPath(impl.name,formdef.path);
            return;
        }

        this.showTitle(impl.title);
        if (path) this.showPath(impl.name,impl.path);

        let funcs:string[] = FormDefinitions.getOnShow(impl.name);
        for(let i = 0; i < funcs.length; i++)  await this.execfunc(impl,funcs[i]);

        impl.onShow();
    }


    private async postform(impl:FormImpl, destroy:boolean)
    {
        impl.onHide();

        let funcs:string[] = FormDefinitions.getOnHide(impl.name);
        for(let i = 0; i < funcs.length; i++)  await this.execfunc(impl,funcs[i]);

        if (destroy)
        {
            this.state.dropForm(impl);
            let funcs:string[] = FormDefinitions.getOnDestroy(impl.name);
            for(let i = 0; i < funcs.length; i++) await this.execfunc(impl,funcs[i]);
        }
    }


    public async execfunc(impl:FormImpl, func:string)
    {
        try
        {
            await impl.form[func]();
        }
        catch (error)
        {
            console.log(error);
        }
    }


    public async callform(form:any, destroy:boolean, parameters?:Map<string,any>)
    {
        if (this.ready != 0)
        {
            setTimeout(() => {this.callform(form,destroy,parameters);},10);
            return;
        }

        if (this.state.form != null)
        {
            // Make sure changes has been validated
            if (!await this.state.form.validate()) return;

            // get current form in chain
            let curr:FormImpl = this.state.form.getChain();

            // let form handle the showform
            await curr.callform(form,destroy,parameters);
        }
    }


    public getCurrentForm() : FormImpl
    {
        if (this.ready != 0)
            return(null);

        if (this.state.form == null)
            return(null);

        return(this.state.form.getChain());
    }


    public async showform(form:any, destroy:boolean, parameters?:Map<string,any>)
    {
        if (this.ready != 0)
        {
            setTimeout(() => {this.showform(form,destroy,parameters);},10);
            return;
        }

        if (this.state.form != null)
        {
            // Make sure changes has been validated
            if (!await this.state.form.validate()) return;

            // if form has called anoother form
            let curr:FormImpl = this.state.form.getChain();

            if (curr != this.state.form)
            {
                // let form handle the showform
                curr.showform(form,destroy,parameters);
                return;
            }

            if (this.state.form.getModalWindow() != null)
                return;

            this.closeform(this.state.form,false);
        }

        if (destroy) this.formsctl.closeform(form,destroy);
        let formdef:FormInstance = this.getFormInstance(form);

        if (formdef == null) return;
        let impl:FormImpl = formdef.formref.instance["_impl_"];
        await this.preform(impl,parameters,formdef,true);

        this.state.form = impl;
        let fmenu:ComponentRef<DropDownMenu> = impl.getDropDownMenu();

        if (!formdef.windowopts?.wizard) this.showMenu(fmenu);
        DropDownMenu.setForm(fmenu,formdef.formref.instance);

        this.formsctl.display(formdef);
    }


    public showinstance(inst:FormInstance) : void
    {
        if (this.ready == 0) this.formsctl.display(inst);
        else setTimeout(() => {this.showinstance(inst);},10);
    }


    public closeform(impl:FormImpl, destroy:boolean) : void
    {
        if (impl == null) return;
        this.postform(impl,destroy);
        this.formsctl.closeform(impl.name,destroy);

        if (this.state.appmenu != null)
            DropDownMenu.setForm(this.state.appmenu,null);

        this.showPath("","");
        this.showTitle(null);
        this.state.form = null;

        this.showMenu(this.state.appmenu);
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


    public showMenu(menu:ComponentRef<DropDownMenu>) : void
    {
        if (this.marea != null)
            this.marea.display(menu);
    }


    public deletemenu(menu:Menu) : void
    {
        this.state.dropMenu(menu);
    }


    public createmenu(menu:Menu) : ComponentRef<DropDownMenu>
    {
        if (menu == null) return(null);

        this.state.addMenu(menu);
        let ddmenu:ComponentRef<DropDownMenu> = this.mfactory.create(menu);

        return(ddmenu);
    }


    private setFormsDefinitions(forms:FormDefinition[]) : void
    {
        for(let i = 0; i < forms.length; i++)
        {
            let fname:string = forms[i].component.name.toLowerCase();
            forms[i].windowopts = FormDefinitions.getWindowOpts(fname);
            forms[i].databaseusage = DatabaseDefinitions.getFormUsage(fname);
        }

        let formsmap:Map<string,FormInstance> =
            this.formsctl.setFormsDefinitions(forms);

        this.instances.setFormsDefinitions(formsmap);
    }


    private showLinkedForm() : void
    {
        if (this.ready != 0)
        {
            // Make time for application setup
            setTimeout(() => {this.showLinkedForm()},500);
            return;
        }

        let form:string = decodeURI(window.location.pathname);

        if (form.length > 0)
            form = this.formsctl.findFormByPath(form);

        if (form != null)
        {
            let inst:FormInstance = this.formsctl.getFormsDefinitions().get(form);

            if (inst == null || !inst.navigable)
            {
                this.showPath("","");
                return;
            }

            let params:Map<string,any> = new Map<string,any>();
            let urlparams = new URLSearchParams(window.location.search);
            urlparams.forEach((value,key) => {params.set(key,value)});
            this.showform(form,false,params);
        }
    }


    public async onEvent(event:any)
    {
        if (Wait.waiting())
            return;

        let keydef:Key =
        {
            code  : event.keyCode,
            alt   : event.altKey,
            ctrl  : event.ctrlKey,
            meta  : event.metaKey,
            shift : event.shiftKey
        }

        let map:string = KeyMapper.map(keydef);
        let key:keymap = KeyMapper.keymap(map);

        if (key == keymap.connect)
        {
            this.app.connect();
            return;
        }

        if (key == keymap.disconnect)
        {
            this.app.disconnect();
            return;
        }

        if (key == keymap.commit)
        {
            let form:FormImpl = this.getCurrentForm();

            if (form != null)
            {
                let event:KeyTriggerEvent = new KeyTriggerEvent(Origin.Form,null,null,key,null);
                if (!form.invokeTriggers(Trigger.Key,event,key)) return;
            }

            this.connection.commit();
            return;
        }

        if (key == keymap.rollback)
        {
            this.connection.rollback();
            return;
        }


        if
        (
            key == keymap.close           ||
            key == keymap.delete          ||
            key == keymap.listval         ||
            key == keymap.clearform       ||
            key == keymap.insertafter     ||
            key == keymap.insertbefore    ||
            key == keymap.enterquery      ||
            key == keymap.executequery
        )
        {
            event.preventDefault();
            let form:FormImpl = this.getCurrentForm();
            if (form != null) form.sendkey(event,key);
        }
    }
}