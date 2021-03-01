import { Menu } from './Menu';
import { Form } from '../forms/Form';
import { MenuEntry } from './MenuEntry';
import { DefaultMenu } from './DefaultMenu';
import { Protected } from '../utils/Protected';
import { MenuInterface } from './MenuInterface';
import { Preferences } from '../application/Preferences';
import { Listener, onEventListener } from '../utils/Listener';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ComponentRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: '',
    template: '<div #html></div>'
})


export class DropDownMenu implements onEventListener, AfterViewInit
{
    private menu:Menu;
    private instance:string;
    private app:ApplicationImpl;
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


    constructor()
    {
        this.instance = "DropDownMenu-"+(DropDownMenu.instances++);
        Reflect.defineProperty(this,"_getProtected", {value: () => {return(this.app)}});
    }


    public getMenu() : Menu
    {
        return(this.menu);
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


    public display(app:ApplicationImpl, menu?:Menu) : void
    {
        if (this.html == null)
        {
            setTimeout(() => {this.display(app,menu);},10);
            return;
        }

        this.app = app;

        if (menu == null)
            menu = new DefaultMenu();

        this.menu = menu;
        let intf:MenuInterface = new MenuInterface(this);
        Protected.set(menu.getHandler(),intf);

        this.menu = menu;
        this.html.innerHTML = this.menuhtml();
        let menus:HTMLCollectionOf<Element> = this.html.getElementsByClassName("ddmenu-menu");
        let options:HTMLCollectionOf<Element> = this.html.getElementsByClassName("ddmenu-option");

        for(let i = 0; i < menus.length; i++)
        {
            let mopt:MenuOption = new MenuOption(menus[i].children[0]);
            this.menus.set(mopt.elem.id,mopt);
            mopt.elem.classList.add("dddmenu-isabled");
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
            Listener.remove(this.instance,"click");
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
            Listener.add(this.instance,this,"click");
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

        html += "<html>\n";
		html += "  <head>\n";
		html += "    <style>\n";
		html += this.styles()+ "\n";
		html += "    </style>\n";
		html += "  </head>\n";
		html += "  <body>\n";
		html += "    <span class='ddmenu-bar'>\n";
		html += this.entries("","",this.menu.getEntries());
		html += "    </span>\n";
        html += "  </body>\n";
		html += "</html>\n";

        return(html);
    }


    private entries(indent:string, path:string, entries:MenuEntry[]) : string
    {
        let html:string = "";

        for(let i = 0; i < entries.length; i++)
        {
            let id:string = path+"/"+entries[i].name.toLowerCase();

            html += indent+"<div class='ddmenu-menu'>\n";
            html += indent+"  <button class='ddmenu-entry' id='"+id+"'";
            html += indent+" style='margin-left: 4px; margin-right: 4px'>\n";
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
        let prefs:Preferences = new Preferences();

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
                border: none;
                color: `+prefs.colors.buttontext+`;
                outline:none;
                cursor: pointer;
                font-size: 16px;
                background: transparent;
            }

            .ddmenu-disabled
            {
                color: `+prefs.colors.disabled+`;
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
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }

            .ddmenu-option
            {
                border: none;
                color: black;
                outline:none;
                cursor: pointer;
                font-size: 16px;
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