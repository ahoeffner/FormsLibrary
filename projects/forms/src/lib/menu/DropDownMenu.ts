import { Menu } from './Menu';
import { Form } from '../forms/Form';
import { MenuEntry } from './MenuEntry';
import { Config } from '../application/Config';
import { MenuInterface } from './MenuInterface';
import { Context } from '../application/Context';
import { Application } from '../application/Application';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { WindowListener, onEventListener } from '../events/WindowListener';
import { Component, ComponentRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: '',
    template: '<div #html></div>'
})


export class DropDownMenu implements onEventListener, AfterViewInit
{
    private menu:Menu;
    private conf:Config;
    private instance:string;
    private app$:ApplicationImpl;
    private html:HTMLDivElement;
    private static instances:number = 0;
    private options:Map<string,Option> = new Map<string,Option>();
    private menus:Map<string,MenuOption> = new Map<string,MenuOption>();

    @ViewChild("html", {read: ElementRef}) private elem: ElementRef;

    private static calls:number = 0;
    public static setForm(inst:ComponentRef<DropDownMenu>, form:Form) : void
    {
        if (inst.instance.getMenu() == null)
        {
            if (DropDownMenu.calls++ > 10) return;
            setTimeout(() => {DropDownMenu.setForm(inst,form)},10);
            return;
        }

        inst.instance.getMenu().getHandler().onFormChange(form);
    }


    constructor(private ctx:Context)
    {
        this.conf = ctx.conf;
        this.app$ = ctx.app["_impl_"]; // might not be initialized
        this.instance = "DropDownMenu-"+(DropDownMenu.instances++);
    }


    public getMenu() : Menu
    {
        return(this.menu);
    }


    public getApplication() : Application
    {
        return(this.app$.getApplication());
    }


    public enable(menu?:string) : void
    {
        if (menu == null)
        {
            this.menus.forEach((mopt) =>
            {
                mopt.elem.classList.remove("ddmenu-disabled");
                mopt.options.forEach((opt) => {opt.elem.children[0].classList.remove("ddmenu-disabled")});
            });
            return;
        }

        menu = menu.toLowerCase();
        let mopt:MenuOption = this.menus.get(menu);

        if (mopt != null)
        {
            mopt.elem.classList.remove("ddmenu-disabled");
            mopt.options.forEach((opt) => {opt.elem.children[0].classList.remove("ddmenu-disabled")});
            return;
        }

        let option:string = menu;
        mopt = this.menus.get(menu.substring(0,menu.lastIndexOf("/")));
        if (mopt == null) return;

        let enabled:number = 0;
        mopt.options.forEach((opt) =>
        {
            if (opt.elem.id == option)
                opt.elem.children[0].classList.remove("ddmenu-disabled");

            if (!opt.elem.children[0].classList.contains("ddmenu-disabled"))
                enabled++;
        });

        if (enabled > 0) mopt.elem.classList.remove("ddmenu-disabled");
    }


    public disable(menu?:string) : void
    {
        if (menu == null)
        {
            this.menus.forEach((mopt) =>
            {
                mopt.elem.classList.add("ddmenu-disabled");
                mopt.options.forEach((opt) => {opt.elem.children[0].classList.add("ddmenu-disabled")});
            });
            return;
        }

        menu = menu.toLowerCase();
        let mopt:MenuOption = this.menus.get(menu);

        if (mopt != null)
        {
            mopt.elem.classList.add("ddmenu-disabled");
            mopt.options.forEach((opt) => {opt.elem.children[0].classList.add("ddmenu-disabled")});
            return;
        }

        let option:string = menu;
        mopt = this.menus.get(menu.substring(0,menu.lastIndexOf("/")));
        if (mopt == null) return;

        let enabled:number = 0;
        mopt.options.forEach((opt) =>
        {
            if (opt.elem.id == option)
                opt.elem.children[0].classList.add("ddmenu-disabled");

            if (!opt.elem.children[0].classList.contains("ddmenu-disabled"))
                enabled++;
        });

        if (enabled == 0) mopt.elem.classList.add("ddmenu-disabled");
    }


    public display(menu?:Menu) : void
    {
        if (menu == null)
            return;

        if (this.html == null)
        {
            setTimeout(() => {this.display(menu);},10);
            return;
        }

        this.app$ = this.ctx.app["_impl_"];

        this.menu = menu;
        let intf:MenuInterface = new MenuInterface(this);
        menu.getHandler()["__menu__"] = intf;

        this.menu = menu;
        this.html.innerHTML = this.menuhtml();
        let menus:HTMLCollectionOf<Element> = this.html.getElementsByClassName("ddmenu-menu");
        let options:HTMLCollectionOf<Element> = this.html.getElementsByClassName("ddmenu-option");

        for(let i = 0; i < menus.length; i++)
        {
            let mopt:MenuOption = new MenuOption(menus[i].children[0]);
            this.menus.set(mopt.elem.id,mopt);
            mopt.elem.classList.add("ddmenu-default");
            mopt.elem.classList.add("ddmenu-disabled");
			mopt.elem.addEventListener("click", (event) => {this.toggle(event)});
        }

        for(let i = 0; i < options.length; i++)
        {
            let id:string = options[i].id;
            let menu:string = id.substring(0,id.lastIndexOf("/"));

            let opt:Option = this.options.get(id);
            options[i].children[0].classList.add("ddmenu-disabled");
			options[i].addEventListener("click", (event) => {this.action(event)});
            opt.elem = options[i];

            let mopt:MenuOption = this.menus.get(menu);
            mopt.options.push(opt);
        }

        menu.getHandler().onInit();
    }


    public onEvent(event:any) : void
    {
        if (!event.target.matches('.ddmenu-entry'))
        {
            this.closeall();
            WindowListener.remove(this.instance,"click");
        }
    }


    private action(event:any) : void
    {
        let handler:any = this.menu.getHandler();

        let link:Element = null;
        let text:Element = event.target;

        if (text.classList.contains("ddmenu-linktext"))
        {
            link = text.parentElement;
        }
        else
        {
            link = text;
            text = text.children[0];
        }

        if (text.classList.contains("ddmenu-disabled"))
            return;

        let opt:Option = this.options.get(link.id);
        if (opt.option.action != null) handler[opt.option.action]();
    }


	private toggle(event:any) : void
	{
		let menu:HTMLElement = event.target;
        let container:HTMLDivElement = menu.parentNode.children[1] as HTMLDivElement;
        if (menu.classList.contains("ddmenu-disabled")) return;

        container.classList.toggle("ddmenu-show");

        if (container.classList.contains("ddmenu-show"))
        {
            this.closeall(container);
            WindowListener.add(this.instance,this,"click");
        }
        else
        {
            container.classList.remove("ddmenu-show");
        }
	}


    private closeall(except?:Element) : void
    {
        let open:HTMLCollectionOf<Element> = this.html.getElementsByClassName("ddmenu-show");

        for(let i = 0; i < open.length; i++)
        {
            if (except == null || open[i].id != except.id)
                open[i].classList.remove("ddmenu-show");
        }
    }


    private menuhtml() : string
    {
        let html:string = "";

		html += "<style>\n";
		html += this.styles()+ "\n";
		html += "</style>\n";
		html += "<span class='ddmenu-bar'>\n";
		html += this.entries("","",this.menu.getEntries());
		html += "</span>\n";

        return(html);
    }


    private entries(indent:string, path:string, entries:MenuEntry[]) : string
    {
        let html:string = "";

        for(let i = 0; i < entries.length; i++)
        {
            let id:string = path+"/"+entries[i].name.toLowerCase();

            html += indent+"<div class='ddmenu-menu'>\n";
            html += indent+"  <button class='ddmenu-entry' id='"+id+"'>\n";
            html += indent+entries[i].name;
            html += indent+"  </button>\n";
            html += indent+"  <div class='ddmenu-content' id='"+id+"-content'>\n";

            if (entries[i].options != null)
            {
                for(let f = 0; f < entries[i].options.length; f++)
                {
                    let entry:MenuEntry = entries[i].options[f];
                    let oid:string = id+"/"+entry.name.toLowerCase();
                    this.options.set(oid,new Option(entries[i].options[f]));

                    html += indent+"    <a class='ddmenu-option' id='"+oid+"'>\n";
                    html += indent+"      <span class='ddmenu-linktext'>"+entry.name+"</span>\n";
                    html += indent+"    </a>\n";
                }
            }

            html += indent+"  </div>\n";
            html += indent+"</div>\n";
        }

        return(html);
    }


	private styles() : string
	{
        let style:string =
        `
            .ddmenu-bar
            {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
                white-space: nowrap;
                background: transparent;
            }

            .ddmenu-entry
            {
                padding: 0;
                border: none;
                color: `+this.conf.colors.menuoption+`;
                outline:none;
                cursor: pointer;
                font-size: 15px;
                margin-top: 1px;
                margin-left: 4px;
                margin-right: 4px;
                margin-bottom: 1px;
                background: transparent;
            }

            .ddmenu-default
            {
                color: `+this.conf.colors.enabled+`;
            }

            .ddmenu-disabled
            {
                color: `+this.conf.colors.disabled+`;
            }

            .ddmenu-menu
            {
                position: relative;
                display: inline-block;
            }

            .ddmenu-content
            {
                z-index: 1;
                display: none;
                overflow: none;
                min-width: 80px;
                position: absolute;
                background-color: #f1f1f1;
                color: `+this.conf.colors.menuoption+`;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }

            .ddmenu-option
            {
                border: none;
                color: black;
                outline:none;
                cursor: pointer;
                font-size: 15px;
                background: transparent;
            }

            .ddmenu-content .ddmenu-option
            {
                color: black;
                display: block;
                padding: 12px 16px;
                text-decoration: none;
            }

            .ddmenu-content .ddmenu-option:hover
            {
                background-color: #ddd;
            }

            .ddmenu-show
            {
                display: block;
            }
        `;

        return(style);
    }

    public ngAfterViewInit(): void
    {
        this.html = this.elem?.nativeElement as HTMLDivElement;
    }
}


class MenuOption
{
    elem:Element;
    options:Option[] = [];

    constructor(elem:Element)
    {
        this.elem = elem;
    }
}


class Option
{
    elem:Element;
    option:MenuEntry;

    constructor(option:MenuEntry)
    {
        this.option = option;
    }
}