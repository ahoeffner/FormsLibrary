import { Application } from '../Application';
import { ApplicationImpl } from '../ApplicationImpl';
import { Implementations } from '../Implementations';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'formarea',
  template: '<p #formarea></p>',
  styleUrls: []
})


export class Form implements AfterViewInit
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
		Implementations.get<ApplicationImpl>(this.app).setForm(this);
	}
}