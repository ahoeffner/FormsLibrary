import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';
import { DefaultMenu } from './DefaultMenu';
import { Preferences } from '../Preferences';
import { Listener, onEventListener } from '../utils/Listener';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: '',
    template: '<div #html></div>'
})


export class DropDownMenu implements onEventListener, AfterViewInit
{
    private menu:Menu;
    private instance:string;
    private html:HTMLDivElement;
    private static instances:number = 0;
    private options:Map<string,Option> = new Map<string,Option>();
    @ViewChild("html", {read: ElementRef}) private elem: ElementRef;


    constructor()
    {
        this.instance = "DropDownMenu-"+(DropDownMenu.instances++);
    }


    public display(menu?:Menu) : void
    {
        if (this.html == null)
        {
            setTimeout(() => {this.display(menu);},10);
            return;
        }

        if (menu == null)
            menu = new DefaultMenu();

        this.menu = menu;
        this.html.innerHTML = this.menuhtml();
        let menus:HTMLCollectionOf<Element> = this.html.getElementsByClassName("menu");
        let options:HTMLCollectionOf<Element> = this.html.getElementsByClassName("option");

        for(let i = 0; i < menus.length; i++)
			menus[i].addEventListener("click", (event) => {this.toggle(event)});

        for(let i = 0; i < options.length; i++)
        {
            let id:string = options[i].id;
            let opt:Option = this.options.get(id);
			options[i].addEventListener("click", (event) => {this.action(event)});
            opt.elem = options[i];
        }
    }


    public onEvent(event:any) : void
    {
        if (!event.target.matches('.entry'))
        {
            this.closeall();
            Listener.remove(this.instance,"click");
        }
    }


    private action(event:any) : void
    {
        let opt:Option = this.options.get(event.target.id);
        console.log(event.target+" clicked action="+opt.option.action);
    }


	private toggle(event:any) : void
	{
		let menu:HTMLElement = event.target;
        let container:HTMLDivElement = menu.parentNode.children[1] as HTMLDivElement;

        container.classList.toggle("show");

        if (container.classList.contains("show"))
        {
            this.closeall(container);
            setTimeout(() => {Listener.add(this.instance,this,"click");},1);
        }
        else
        {
            container.classList.remove("show");
        }
	}


    private closeall(except?:Element) : void
    {
        let open:HTMLCollectionOf<Element> = this.html.getElementsByClassName("show");

        for(let i = 0; i < open.length; i++)
        {
            if (except == null || open[i].id != except.id)
                open[i].classList.remove("show");
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
		html += "    <span class='bar'>\n";
		html += this.entries("","",this.menu.entries);
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
            let id:string = path+"/"+entries[i].name;

            html += indent+"<div class='menu'>\n";
            html += indent+"  <button id='"+id+"' class='entry'";
            html += indent+" style='margin-left: 4px; margin-right: 4px'>\n";
            html += indent+entries[i].name;
            html += indent+"  </button>\n";
            html += indent+"  <div id='"+id+"-content' class='content'>\n";

            if (entries[i].options != null)
            {
                for(let f = 0; f < entries[i].options.length; f++)
                {
                    let entry:MenuEntry = entries[i].options[f];
                    this.options.set(id+"/"+entry.name,new Option(entries[i].options[f]));

                    html += indent+"    <a class='option' id='"+id+"/"+entry.name+"'>\n";
                    html += indent+entry.name+"\n";
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
            .bar
            {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
                white-space: nowrap;
                background: transparent;
            }

            .entry
            {
                border: none;
                color: `+prefs.btnTextColor+`;
                outline:none;
                cursor: pointer;
                font-size: 16px;
                background: transparent;
            }

            .menu
            {
                position: relative;
                display: inline-block;
            }

            .content
            {
                z-index: 1;
                display: none;
                overflow: none;
                min-width: 80px;
                position: absolute;
                background-color: #f1f1f1;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }

            .option
            {
                border: none;
                color: black;
                outline:none;
                cursor: pointer;
                font-size: 16px;
                background: transparent;
            }

            .content .option
            {
                color: black;
                display: block;
                padding: 12px 16px;
                text-decoration: none;
            }

            .content .option:hover
            {
                background-color: #ddd;
            }

            .show
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


class Option
{
    elem:Element;
    option:MenuEntry;

    constructor(option:MenuEntry)
    {
        this.option = option;
    }
}