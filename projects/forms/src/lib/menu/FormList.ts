import { Protected } from '../utils/Protected';
import { FormInstance } from '../forms/FormInstance';
import { Application } from '../application/Application';
import { Preferences } from '../application/Preferences';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';


interface Form
{
	name:string;
	def:FormInstance;
}


@Component({
    selector: 'formlist',
    template:
	`
		<div #html style="display: inline-block; white-space: nowrap;"></div>
	`,
    styles: []
  })

export class FormList implements AfterViewInit
{
	private root:Folder;
	private page:string = "";
	private app:ApplicationImpl;
	private html:HTMLDivElement;
	private ready:boolean = false;
	private formsdef:FormInstance[];
	private preferences:Preferences = new Preferences();
	private folders:Map<string,Element> = new Map<string,Element>();

    @Input('root') name: string = "/";
    @ViewChild("html", {read: ElementRef}) private elem: ElementRef;

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
		this.page += "  <body>\n";
		this.page += "    <div id='FolderList'>\n";
		this.page += this.print("/",this.root,0,true);
		this.page += "    </div>\n";
		this.page += "  </body>\n";
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


	private print(path:string, root:Folder, level:number, last:boolean) : string
	{
		let html:string = "";

		html += this.folder(path,root,level,last);

		if (path == "/") path = "";
		for(let i = 0; i < root.folders.length; i++)
		{
			last = false;
			let folder:Folder = root.folders[i];
			if (i == root.folders.length - 1) last = true;
			html += this.print(path+"/"+folder.name,folder,level+1,last);
		}

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
		this.html = this.elem?.nativeElement as HTMLDivElement;

		this.html.innerHTML = this.page;
		let folders:HTMLCollectionOf<Element> = this.html.getElementsByClassName("folder");

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

		let forms:HTMLCollectionOf<Element> = this.html.getElementsByClassName("form");

		for(let i = 0; i < forms.length; i++)
		{
			let form:Element = forms.item(i);
			form.addEventListener("click", (event) => this.show(event));
		}

		//this.open("/");
		//this.folders.get("/").innerHTML = this.name;
		this.ready = true;
	}


	private toggle(event:any) : void
	{
		let folder:HTMLElement = event.target;
		let entry:Element = folder.parentElement.parentElement;
		entry.children[1].classList.toggle('active');
		folder.classList.toggle("folder-open");
	}


	private show(event:any) : void
	{
		let form:HTMLElement = event.target.id;
		this.app.showform(form,false);
	}


	private folder(path:string, root:Folder, level:number, last:boolean) : string
	{
		let html:string = "";
		let lc:string = " <span class='vln'></span>\n";
		if  (last) lc = " <span class='end'></span>\n";

		html += "<div class='folder'>\n";

		if (level > 0)
		{
			html += "<span class='ind'></span>\n";
		}

		for(let i = 1; i < level; i++)
		{
			html += "<span class='lct'>\n";
			html += " <span class='vln'></span>\n";
			html += " <span class='vln'></span>\n";
			html += "</span>\n";
			html += "<span class='ind'></span>\n";
		}

		if (level > 0)
		{
			html += "<span class='lct'>\n";
			html += " <span class='off'></span>\n";
			html += " <span class='cnr'></span>\n";
			html += lc;
			html += "</span>\n";
		}

		html += "<img src='/assets/open.jpg'>\n";
		html += "<span id='"+path+"' class='txt'>"+root.name+"</span>\n";
		html += "</div>\n";

		for(let i = 0; i < root.forms.length; i++)
		{
			last = false;
			if (i == root.forms.length - 1) last = true;
			html += this.form();
		}

		return(html);
	}


	private form() : string
	{
		return("");
	}


	private styles() : string
	{
		let styles:string =
		`
    	.folder
    	{
			margin: 0;
			padding: 0;
			font-size: 0;
			cursor: pointer;
			position: relative;
			border-collapse: collapse;
    	}

		.lct
		{
			width: 16px;
			height: 24px;
			white-space: nowrap;
			display: inline-block;
			vertical-align: middle;
		}

		.txt
		{
			width: 16px;
			height: 21px;
			font-size: 16px;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
		}

		.off
		{
			width: 16px;
			height: 4px;
			display: block;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.vln
		{
			width: 16px;
			height: 12px;
			display: block;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.cnr
		{
			width: 16px;
			height: 8px;
			display: block;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
			border-bottom: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.end
		{
			width: 16px;
			height: 12px;
			display: block;
		}

		img
		{
			width: 24px;
			height: 24px;
			vertical-align: middle;
		}

		.ind
		{
			width: 12px;
			height: 24px;
			white-space: nowrap;
			display: inline-block;
			vertical-align: middle;
		}

		.link
		{
			width: 16px;
			height: 19px;
			font-size: 16px;
			margin-left: 8px;
			font-style: italic;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
			color: `+this.preferences.colors.link+`;
		}

		.forms
		{
			margin: 0;
			padding: 0;
			font-size: 0;
			border-collapse: collapse;
			display: none;
			cursor: pointer;
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