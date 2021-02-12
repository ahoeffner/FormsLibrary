import { Application } from '../application/Application';
import { Component, ViewChild,ElementRef } from '@angular/core';


@Component({
    selector: 'formlist',
    template: '<div style="display: inline-block; white-space: nowrap;" #tree></div>',
    styles: []
  })

export class FormList
{
	private root:Folder;
	private page:string = "";

	private test:string[] = [];

	private tree:HTMLDivElement;
    @ViewChild("tree", {read: ElementRef}) private treelem: ElementRef;

    constructor(app:Application)
    {
		this.root = new Folder("/","Forms");

		this.test.push("main");
		this.test.push("/dept/fdept");
		this.test.push("/dept/depts/sales/fsales1");
		this.test.push("/dept/depts/sales/fsales2");
		this.test.push("/dept/depts/consulting/cons1");
		this.test.push("/dept/depts/consulting/cons2");
		this.test.push("/loc/locs/US/fus1");
		this.test.push("/loc/locs/US/fus2");
		this.test.push("/loc/locs/UK/fuk1");
		this.test.push("/loc/floc");

		this.parse();

		this.page += "<html>\n";
		this.page += "  <head>\n";
		this.page += "    <style>\n";
		this.page += this.styles()+ "\n";
		this.page += "    </style>\n";
		this.page += "  </head>\n";
		this.page += "    <ul id='Tree'>\n";
		this.page += this.print(this.root,"      ");
		this.page += "    </ul>\n";
		this.page += "</html>\n";

		//console.log(this.page);
	}


	private print(root:Folder, indent:string) : string
	{
		let html:string = "";

		html += indent+"<li><span id="+root.id+" class='folder'>"+root.name+"</span>\n";
		html += indent+"  <ul class='form'>\n";

		for(let i = 0; i < root.folders.length; i++)
		{
			let folder:Folder = root.folders[i];
			html += this.print(folder,indent+"  ");
		}

		for(let f = 0; f < root.forms.length; f++)
		{
			let form:string = root.forms[f];
			html += indent+"  <li>"+form+"</li>\n";
		}

		html += "  </ul>";
		html += "</li>";

		return(html);
	}


	private parse() : void
	{
		for(let i = 0; i < this.test.length; i++)
		{
			let path:string = this.test[i];

			let form:string = path;
			let folder:string = "/";

			let pos:number = path.lastIndexOf("/");

			if (pos >= 0)
			{
				form = path.substring(pos+1);
				folder = path.substring(0,pos);
			}

			let current:Folder = this.root;
			let parts:string[] = folder.split("/");

			for(let p = 1; p < parts.length; p++)
			{
				if (parts[p] == "") parts[p] = "/";
				current = current.getFolder(parts[p].trim());
			}

			current.addForm(form);
		}
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


class Folder
{
	id:string;
	name:string;
	forms:string[] = [];
	folders:Folder[] = [];

	constructor(id:string, name:string)
	{
		this.id = id;
		this.name = name;
	}

	getFolder(next:string) : Folder
	{
		if (next == this.id) return(this);

		for(let i = 0; i < this.folders.length; i++)
			if (this.folders[i].id == next) return(this.folders[i]);

		let folder:Folder = new Folder(next,next);
		this.folders.push(folder);

		return(folder);
	}


	addForm(form:string) : void
	{
		this.forms.push(form);
	}
}