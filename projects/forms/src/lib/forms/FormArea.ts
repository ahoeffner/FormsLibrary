import { Context } from '../application/Context';
import { Application } from '../application/Application';
import { ApplicationImpl } from '../application/ApplicationImpl';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'formarea',
  template: '<div #formarea></div>',
  styleUrls: []
})


export class FormArea implements AfterViewInit
{
	private app:Application = null;
	@ViewChild("formarea", {read: ElementRef}) private formarea: ElementRef;

	constructor(ctx:Context)
	{
		this.app = ctx.app;
	}

	public getFormsArea() : HTMLElement
	{
        return(this.formarea.nativeElement);
	}

	public ngAfterViewInit(): void
	{
		let impl:ApplicationImpl = this.app["_impl_"];
		impl.setFormArea(this);
	}
}