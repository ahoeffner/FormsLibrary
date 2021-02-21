import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';
import { DefaultMenu } from './DefaultMenu';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Preferences } from '../Preferences';

@Component({
    selector: '',
    template: '<div #html></div>'
})


export class DropDownMenu implements AfterViewInit
{
    private menu:Menu;
    private html:HTMLDivElement;
    @ViewChild("html", {read: ElementRef}) private elem: ElementRef;

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

        for(let i = 0; i < menus.length; i++)
        {
			menus[i].addEventListener("click", this.toggle);
        }
    }


	private toggle(event:any) : void
	{
		let menu:HTMLElement = event.target;
		menu.classList.toggle("show");

        if (menu.classList.contains("show"))
        {
            let options:HTMLDivElement = menu.parentNode.children[1] as HTMLDivElement;
            options.classList.add("show");
        }
        else
        {
            let options:HTMLDivElement = menu.parentNode.children[1] as HTMLDivElement;
            options.classList.remove("show");
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
            console.log("id="+id);

            html += indent+"<div class='menu'>\n";
            html += indent+"  <button id='"+id+"' class='entry'";
            html += indent+" style='margin-left: 4px; margin-right: 4px'>\n";
            html += indent+entries[i].name;
            html += indent+"  </button>\n";
            html += indent+"  <div class='content'>\n";

            if (entries[i].options != null)
            {
                for(let f = 0; f < entries[i].options.length; f++)
                {
                    let entry:MenuEntry = entries[i].options[f];
                    html += indent+"    <button class='option' id='"+id+"/"+entry.name+"'>\n";
                    html += indent+entry.name+"\n";
                    html += indent+"    </button>\n";
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
                overflow: auto;
                min-width: 80px;
                position: absolute;
                background-color: #f1f1f1;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }

            options
            {
                color: black;
                display: block;
                padding: 12px 16px;
                text-decoration: none;
            }

            options:hover
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