import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';
import { DefaultMenu } from './DefaultMenu';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

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
		html += this.entries("      ",this.menu.entries);
		html += "    </span>\n";
        html += "  </body>\n";
		html += "</html>\n";

        return(html);
    }


    private entries(indent:string, entries:MenuEntry[]) : string
    {
        let html:string = "";

        for(let i = 0; i < entries.length; i++)
        {
            console.log("add "+entries[i].name);
            html += indent+"<div class='menu'>\n";
            html += indent+"  <button id='"+entries[i].name+"' class='entry'>"+entries[i].name+"</button>\n";
            html += indent+"  <div id='"+entries[i].name+"-options' class='content'>\n";
            html += indent+"    <a id='home1' href='#home'>Home1</a>\n";
            html += indent+"    <a id='home2' href='#home'>Home2</a>\n";
            html += indent+"  </div>\n";
            html += indent+"</div>\n";
        }

        return(html);
    }


	private styles() : string
	{
        let style:string =
        `
            .bar
            {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
                border: 2px solid black;
                white-space: nowrap;
                background-color: grey;
            }

            .entry
            {
                border: none;
                color: black;
                cursor: pointer;
                font-size: 16px;
                background-color: transparent;
            }

            .entry:hover, .entry:focus
            {
                background-color: #2980B9;
            }

            .menu
            {
                position: relative;
                display: inline-block;
            }

            .content
            {
                display: none;
                position: absolute;
                background-color: #f1f1f1;
                min-width: 160px;
                overflow: auto;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                z-index: 1;
            }

            .content a
            {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
            }

            .content a:hover
            {
                background-color: #ddd;
            }

            .show
            {
                display:
                block;
            }
        `;

        return(style);
    }

    public ngAfterViewInit(): void
    {
        this.html = this.elem?.nativeElement as HTMLDivElement;
    }
}