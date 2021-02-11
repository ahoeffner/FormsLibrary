import { Application } from '../application/Application';
import { Component, ViewChild,ElementRef } from '@angular/core';


@Component({
    selector: 'formlist',
    template: '<div style="display: inline-block; white-space: nowrap;" #tree></div>',
    styles: []
  })

export class FormList
{
	public page:string = "";
	public tree:HTMLDivElement;
    @ViewChild("tree", {read: ElementRef}) private treelem: ElementRef;

    constructor(app:Application)
    {
		this.page += "<html>\n";
		this.page += "  <head>\n";
		this.page += "    <style>\n";
		this.page += this.styles()+ "\n";
		this.page += "    </style>\n";
		this.page += "  </head>\n";
		this.page += "  <ul id='Tree'>\n";
		this.page += "     <li><span id='/' class='folder'>Forms</span>\n";
		this.page += "       <ul class='form'>\n";
		this.page += this.content("/",1) + "\n";
		this.page += "       </ul>\n";
		this.page += "	   </li>\n";
		this.page += "   </ul>\n";
		this.page += "</html>\n";

		console.log(this.page);
	}


	public ngAfterViewInit(): void
	{
		this.tree = this.treelem?.nativeElement as HTMLDivElement;
		this.tree.innerHTML = this.page;

		let folders:HTMLCollectionOf<Element> = this.tree.getElementsByClassName("folder");

		for(let i = 0; i < folders.length; i++)
		{
			let folder:Element = folders.item(i);
			folder.addEventListener("click", this.openclose);
		}
	}


	public openclose(event:any): void
	{
		let folder:HTMLElement = event.target;
		folder.parentElement.querySelector('.form').classList.toggle('active');
		folder.classList.toggle("folder-open");
	}


	private content(parent:string, indent:number) : string
	{
		let list:string = "";
		let folders:string[] = this.getFolders(parent);

		for(let folder of folders)
		{
			list += "<li><span class='folder'>"+folder+"</span>\n";
			let forms:string[] = this.getForms(parent+folder+"/");

			list += "<ul class='form'>\n";
			for(let form of forms)
				list += "<li>"+form+"</li>\n";
			list += "</ul>\n";

			list += this.content(parent+folder+"/",0);

			list += "</li>\n";
		}

		return(list);
	}


	private getFolders(parent:string) : string[]
	{
		console.log("Get sub for <"+parent+">")
		if (parent == "/")
		{
			return(["dept","emp"] as string[]);
		}

		if (parent == "/dept")
		{
			return(["subdept1","subdept2"]);
		}

		if (parent == "/emp")
		{
			return(["subemp"]);
		}

		return([]);
	}


	private getForms(parent:string) : string[]
	{
		if (parent == "/")
		{
			return(["dept","emp"]);
		}

		if (parent == "/dept")
		{
			return(["subdept1","subdept2"]);
		}

		if (parent == "/emp")
		{
			return(["subemp"]);
		}

		return([]);
	}


	private styles() : string
	{
		let styles:string =
		`
		ul, #Tree
		{
			list-style-type: none;
		}

		#Tree
		{
			margin: 0;
			padding: 0;
		}

		.folder
		{
			cursor: pointer;
			-webkit-user-select: none; /* Safari 3.1+ */
			-moz-user-select: none; /* Firefox 2+ */
			-ms-user-select: none; /* IE 10+ */
			user-select: none;
		  }

		.folder::before
		{
			content: "\\25B6";
			color: black;
			display: inline-block;
			margin-right: 6px;
		}

		.folder-open::before
		{
			-ms-transform: rotate(90deg); /* IE 9 */
			-webkit-transform: rotate(90deg); /* Safari */'
			transform: rotate(90deg);
		}

		.form
		{
			display: none;
		}

		.active
		{
			display: block;
		}
		`;

		return(styles);
	}
}