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
		this.page += "    <div class='folder-tree'>\n";
		this.page += this.print("/",this.root,0,[true]);
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
/*
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
*/
	}


	private print(path:string, root:Folder, level:number, last:boolean[]) : string
	{
		let html:string = "";

		html += this.folder(path,root,level,last);
		html += "<div class='folder-content' id='"+path+"-content'>";

		level++;
		last.push(false);
		if (path == "/") path = "";
		let subs:number = root.folders.length;
		let forms:number = root.forms.length;

		for(let i = 0; i < subs; i++)
		{
			let folder:Folder = root.folders[i];

			if (i == subs - 1 && forms == 0)
				last[level] = true;

			html += this.print(path+"/"+folder.name,folder,level,last);
		}

		last[level] = false;
		html += this.forms(root,level,last);
		last.pop();

		html += "</div>";
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
		this.html = this.elem?.nativeElement as HTMLDivElement;

		this.html.innerHTML = this.page;
		let folders:HTMLCollectionOf<Element> = this.html.getElementsByClassName("folder");

		for (let i = 0; i < folders.length; i++)
		{
			let container:Element = folders.item(i);
			let content:Element = document.getElementById(container.id+"-content");
			let img:Element = container.querySelector("[id='"+container.id+"-img']");
			let lnk:Element = container.querySelector("[id='"+container.id+"-lnk']");

			let folder:Folder = this.root.findFolder(container.id.split("/"));

			folder.img = img;
			folder.lnk = lnk;
			folder.content = content;
			folder.img.addEventListener("click",(event) => this.toggle(event));
			folder.lnk.addEventListener("click",(event) => this.toggle(event));
		}

		let forms:HTMLCollectionOf<Element> = this.html.getElementsByClassName("form");

		for(let i = 0; i < forms.length; i++)
		{
			let form:Element = forms.item(i);
			form.addEventListener("click", (event) => this.show(event));
		}

		//this.open("/");
		this.root.lnk.innerHTML = this.name;
		this.ready = true;
	}


	private toggle(event:any) : void
	{
		let fname:string = event.target.id;
		fname = fname.substring(0,fname.length-4);

		let folder:Folder = this.root.findFolder(fname.split("/"));
		folder.content.classList.toggle("active");
	}


	private show(event:any) : void
	{
		let form:HTMLElement = event.target.id;
		this.app.showform(form,false);
	}


	private folder(path:string, root:Folder, level:number, last:boolean[]) : string
	{
		let html:string = "";
		html += "<div id='"+path+"' class='folder'>\n";

		if (level > 0)
		{
			html += this.half();
			for(let i = 1; i < level; i++)
				html += this.indent(last[i]);
		}

		if (level > 0) html += this.pre(last[level]);
		html += "<img id='"+path+"-img' src='/assets/open.jpg'>\n";
		html += "<span id='"+path+"-lnk' class='txt'>"+root.name+"</span>\n";
		html += "</div>\n";

		return(html);
	}


	private forms(root:Folder, level:number, last:boolean[]) : string
	{
		let html:string = "";

		for(let i = 0; i < root.forms.length; i++)
		{
			if (i == root.forms.length - 1) last[level] = true;
			html += this.form(root.forms[i],level,last);
		}

		return(html);
	}


	private form(form:Form, level:number, last:boolean[])
	{
		let html:string = "";
		html += "<div id='"+form.def.path+"' class='form'>\n";

		html += this.half();
		for(let i = 1; i < level; i++)
			html += this.indent(last[i]);

		if (level > 0) html += this.pre(last[last.length-1]);

		//html += "<img id='"+form.def.path+"-img' src='/assets/form.jpg'>\n";
		html += "<span id='"+form.def.path+"-lnk' class='link'> "+form.def.name+"</span>\n";
		html += "</div>\n";

		return(html);
	}


	private pre(last:boolean) : string
	{
		let html:string = "";

		html += "<span class='lct'>\n";
		html += " <span class='off'></span>\n";
		html += " <span class='cnr'></span>\n";

		if (last) html += "<span class='end'></span>\n";
		else	  html += "<span class='vln'></span>\n";

		html += "</span>\n";

		return(html);
	}


	private indent(skip:boolean) : string
	{
		let html:string = "";
		if (skip)
		{
			html += "<span class='lct'>\n";
			html += "</span>\n";
			html += " <span class='ind'></span>\n";
		}
		else
		{
			html += "<span class='lct'>\n";
			html += " <span class='vln'></span>\n";
			html += " <span class='vln'></span>\n";
			html += " <span class='vln'></span>\n";
			html += "</span>\n";
			html += " <span class='ind'></span>\n";
		}
		return(html);
	}


	private half() : string
	{
		let html:string = "";
		html += " <span class='ind'></span>\n";
		return(html);
	}


	private styles() : string
	{
		let styles:string =
		`
		.folder-tree
		{
			position: fixed;
		}

    	.folder
    	{
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			font-size: 0;
			position: relative;
			border-collapse: collapse;
    	}

		.folder-content
		{
			display: none;
		}

		.lct
		{
			width: 16px;
			height: 24px;
			pointer-events:none;
			white-space: nowrap;
			display: inline-block;
			vertical-align: middle;
		}

		.txt
		{
			width: 16px;
			height: 21px;
			font-size: 16px;
			cursor: pointer;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
		}

		.off
		{
			width: 16px;
			height: 4px;
			display: block;
			pointer-events:none;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.vln
		{
			width: 16px;
			height: 12px;
			display: block;
			pointer-events:none;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.cnr
		{
			width: 16px;
			height: 8px;
			display: block;
			pointer-events:none;
			border-left: 1px solid `+this.preferences.colors.foldertree+`;
			border-bottom: 1px solid `+this.preferences.colors.foldertree+`;
		}

		.end
		{
			width: 16px;
			height: 12px;
			display: block;
			pointer-events:none;
		}

		.ind
		{
			width: 12px;
			height: 24px;
			white-space: nowrap;
			pointer-events:none;
			display: inline-block;
			vertical-align: middle;
		}

		img
		{
			width: 24px;
			height: 24px;
			cursor: pointer;
			vertical-align: middle;
		}

		.link
		{
			width: 16px;
			height: 22px;
			cursor: pointer;
			font-size: 16px;
			margin-left: 8px;
			font-style: italic;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
			color: `+this.preferences.colors.link+`;
		}

		.form
		{
			margin: 0;
			padding: 0;
			font-size: 0;
			display: block;
			border-collapse: collapse;
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

	img:Element;
	lnk:Element;
	content:Element;

	constructor(name:string)
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

	findFolder(path:string[]) : Folder
	{
		while(path[0] == "") path.shift();
		if (path.length == 0) return(this);

		let next:Folder = null;
		for(let i = 0; i < this.folders.length; i++)
		{
			if (this.folders[i].name == path[0])
			{
				next = this.folders[i];
				break;
			}
		}

		if (next == null)
		{
			console.log("this: "+this.name+" could not find <"+path[0]+">");
			return(null);
		}

		path.shift();
		return(next.findFolder(path));
	}

	addForm(name:string, form:FormInstance) : void
	{
		this.forms.push({name:name, def:form});
	}

	print() : void
	{
		console.log(this.name);
		for(let i = 0; i < this.folders.length; i++)
			this.folders[i].print();
	}
}