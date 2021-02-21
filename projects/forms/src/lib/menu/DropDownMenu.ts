import { Menu } from './Menu';
import { DefaultMenu } from './DefaultMenu';
import { DropDownEntry } from './DropDownEntry';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'basemenu',
    template:
	`
		<div #html style="">Hello</div>
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


    constructor()
    {
        this.display();
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
    }


    private menuhtml() : string
    {
        let html:string = "";

        html += "<html>\n";
		html += "  <head>\n";
		html += "    <style>\n";
		//html += this.styles()+ "\n";
		html += "    </style>\n";
		html += "  </head>\n";
		html += "  <body>\n";
		html += this.entries(this.menu.entries)+ "\n";
        html += "  </body>\n";
		html += "</html>\n";

        console.log(html);
        return(html);
    }


    private entries(entries:DropDownEntry[]) : string
    {
        let html:string = "";

        html += "<div class='menu'>";
        html += "<div id='dropdown' class='content'>";
        html += "<button>"+"Test"+"</button>";

        for(let i = 0; i < entries.length; i++)
        {
            if (entries[i].options != null) this.entries(entries[i].options);
            else html += "<button>"+entries[i].name+"</button>";
        }

        html += "</div class='menu'>";
        return(html);
    }


	private styles() : string
	{
        let style:string =
        `
            .dropbtn
            {
                background-color: #3498DB;
                color: white;
                padding: 16px;
                font-size: 16px;
                border: none;
                cursor: pointer;
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
    }
}