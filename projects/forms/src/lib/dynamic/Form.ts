import { Application } from '../Application';
import { ApplicationImpl } from '../ApplicationImpl';
import { Implementations } from '../Implementations';
import { Component, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'formarea',
  template: '<p #formarea></p>',
  styleUrls: []
})


export class Form
{
	@ViewChild("formarea", {read: ElementRef}) private formarea: ElementRef;


	constructor(appintf:Application)
	{
		Implementations.get<ApplicationImpl>(appintf).setForm(this);
	}

	public getFormsArea() : HTMLElement
	{
        return(this.formarea.nativeElement);
	}
}