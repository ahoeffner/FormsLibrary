import { Preferences } from '../Preferences';
import { Protected } from '../utils/Protected';
import { FormInstance } from '../forms/FormInstance';
import { Application } from '../application/Application';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';

interface Form
{
	name:string;
	def:FormInstance;
}


@Component({
    selector: 'formlist',
    template:
	`
		<div style="display: inline-block; white-space: nowrap;" #tree></div>
	`,
    styles: []
  })

export class FormList
{
	private root:Folder;
	private page:string = "";
	private app:ApplicationImpl;
	private tree:HTMLDivElement;
	private ready:boolean = false;
	private formsdef:FormInstance[];
	private folders:Map<string,Element> = new Map<string,Element>();

    @Input('root') name: string = "/";
    @ViewChild("tree", {read: ElementRef}) private treelem: ElementRef;

    constructor(app:Application)
    {
		this.root = new Folder(this.name);
		this.app = Protected.get<ApplicationImpl>(app);

		this.app.setFormList(this);

		this.formsdef = this.app.getFormsList();
		this.parse();

		this.page += "<html>\n";
		this.page += "  <head>\n";
		this.page += "    <style>\n";
		this.page += this.styles()+ "\n";
		this.page += "    </style>\n";
		this.page += "  </head>\n";
		this.page += "  <ul id='Tree'>\n";
		this.page += this.print("/",this.root,"    ");
		this.page += "  </ul>\n";
		this.page += "</html>\n";
	}


	public open(folder:string) : void
	{
		if (!this.ready)
		{
			setTimeout(() => {this.open(folder);},10);
			return;
		}

		let path:string = "";
		folder = folder.trim();
		let parts:string[] = folder.split("/");

		let elem:Element = this.folders.get("/");
		if (elem != null && !elem.classList.contains("folder-open"))
			this.toggle({target: elem});

		for(let p = 1; p < parts.length; p++)
		{
			path = path + "/" + parts[p];
			elem = this.folders.get(path);

			if (elem != null && !elem.classList.contains("folder-open"))
				this.toggle({target: elem});
		}
	}


	private print(path:string, root:Folder, indent:string) : string
	{
		let html:string = "";

		html += indent+"<li><span id='"+path+"' class='folder'>"+root.name+"</span>\n";
		html += indent+"  <ul class='list'>\n";

		if (path == "/") path = "";
		for(let i = 0; i < root.folders.length; i++)
		{
			let folder:Folder = root.folders[i];
			html += this.print(path+"/"+folder.name,folder,indent+"  ");
		}

		for(let f = 0; f < root.forms.length; f++)
		{
			let form:Form = root.forms[f];
			html += indent+"  <li><span id='"+form.def.name+"' title='"+form.def.title+"' class='form'>"+form.name+"</span></li>\n";
		}

		html += "  </ul>";
		html += "</li>";

		return(html);
	}


	private parse() : void
	{
		for(let i = 0; i < this.formsdef.length; i++)
		{
			let path:string = this.formsdef[i].path;
			if (!this.formsdef[i].navigable) continue;

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

			current.addForm(form,this.formsdef[i]);
		}
	}


	public ngAfterViewInit(): void
	{
		this.root.setName(this.name);
		this.tree = this.treelem?.nativeElement as HTMLDivElement;

		this.tree.innerHTML = this.page;
		let folders:HTMLCollectionOf<Element> = this.tree.getElementsByClassName("folder");

		for(let i = 0; i < folders.length; i++)
		{
			let folder:Element = folders.item(i);
			folder.addEventListener("click", this.toggle);
		}

		for (let i = 0; i < folders.length; i++)
		{
			let folder:Element = folders.item(i);
			this.folders.set(folder.id,folder);
		}

		let forms:HTMLCollectionOf<Element> = this.tree.getElementsByClassName("form");

		for(let i = 0; i < forms.length; i++)
		{
			let form:Element = forms.item(i);
			form.addEventListener("click", (event) => this.show(event));
		}

		this.open("/");
		this.folders.get("/").innerHTML = this.name;
		this.ready = true;
	}


	private toggle(event:any) : void
	{
		let folder:HTMLElement = event.target;
		folder.parentElement.querySelector('.list').classList.toggle('active');
		folder.classList.toggle("folder-open");
	}


	private show(event:any) : void
	{
		let form:HTMLElement = event.target.id;
		this.app.showform(form,false);
	}


	private styles() : string
	{
		let styles:string =
		`
		ul, li, #Tree
		{
			padding-left: 8px;
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
		}

		.folder::before
		{
			width:24px;
			height: 24px;
			content: "";
			margin-right: 2px;
			display: inline-block;
			vertical-align: middle;
			background-size: 100% 100%;
			background-image:url('/assets/closed.jpg');
		}

		.folder-open::before
		{
			width:24px;
			height: 24px;
			content: "";
			margin-right: 2px;
			display: inline-block;
			vertical-align: middle;
			background-size: 100% 100%;
			background-image:url('/assets/open.jpg');
		}

		.form
		{
			color: formcolor;
			font-style: italic;
		}

		.form::before
		{
			color: formcolor;
			content: "-";
			margin-left: 8px;
			margin-right: 8px;
			display: inline-block;
			vertical-align: middle;
		}

		.list
		{
			display: none;
			cursor: pointer;
		}

		.active
		{
			display: block;
		}
		`;

		let color:string = Preferences.get().primaryColor;
		styles = styles.replace("formcolor",color);

		return(styles);
	}
}


class Folder
{
	name:string;
	forms:Form[] = [];
	folders:Folder[] = [];

	constructor(name:string)
	{
		this.name = name;
	}

	setName(name:string) : void
	{
		this.name = name;
	}

	getFolder(next:string) : Folder
	{
		if (next == this.name) return(this);

		for(let i = 0; i < this.folders.length; i++)
			if (this.folders[i].name == next) return(this.folders[i]);

		let folder:Folder = new Folder(next);
		this.folders.push(folder);

		return(folder);
	}


	addForm(name:string, form:FormInstance) : void
	{
		this.forms.push({name:name, def:form});
	}
}