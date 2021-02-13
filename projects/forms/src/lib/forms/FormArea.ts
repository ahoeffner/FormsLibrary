import { Protected } from '../utils/Protected';
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
	@ViewChild("formarea", {read: ElementRef}) private formarea: ElementRef;

	constructor(private app:Application)
	{
	}

	public getFormsArea() : HTMLElement
	{
        return(this.formarea.nativeElement);
	}

	public ngAfterViewInit(): void
	{
		Protected.get<ApplicationImpl>(this.app).setFormArea(this);
	}
}