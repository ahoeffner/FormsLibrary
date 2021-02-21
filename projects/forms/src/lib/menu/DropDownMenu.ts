import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';
import { DefaultMenu } from './DefaultMenu';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: '',
    template:
	`
		<div #html></div>
	`,
    styles:
    [
    `
        .menu
        {
            color: black;
            white-space: nowrap;
            display: inline-block;
        }
    `
    ]
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
        console.log("html injected");
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
		html += this.entries("    ",this.menu.entries)+"\n";
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
            html += indent+"<div class='dropdown'>\n";
            html += indent+"  <button class='dropdown'>"+entries[i].name+"</button>\n";
            html += indent+"  <div id='"+entries[i].name+"' class='content'>\n";
            html += indent+"    <a href='#home'>Home1</a>\n";
            html += indent+"    <a href='#home'>Home2</a>\n";
            html += indent+"  </div>\n";
            html += indent+"</div>\n";
        }

        return(html);
    }


	private toggle(event:any) : void
	{
        console.log("toogle ");
		let menu:HTMLElement = event.target;
		menu.classList.toggle("show");
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

            .dropdown
            {
                border: none;
                color: black;
                cursor: pointer;
                font-size: 16px;
                background-color: transparent;
            }

            .dropbtn:hover, .dropbtn:focus
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

            .dropdown-content a
            {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
            }

            .dropdown a:hover
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
        let menus:HTMLCollectionOf<Element> = this.html.getElementsByClassName("dropdown");

        console.log("dropdowns: "+menus.length);

        for(let i = 0; i < menus.length; i++)
        {
            console.log("add toogle "+menus[i].id);
			menus[i].addEventListener("click", this.toggle);
        }
    }
}