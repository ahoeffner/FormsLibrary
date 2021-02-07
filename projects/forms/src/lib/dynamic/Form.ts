import { Application } from '../Application';
import { ApplicationImpl } from '../ApplicationImpl';
import { Implementations } from '../Implementations';
import { Component, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'form',
  template: '<div #formarea></div>',
  styleUrls: []
})


export class Form
{
	@ViewChild("formarea") private formarea: ElementRef;

	constructor(appintf:Application)
	{
		Implementations.get<ApplicationImpl>(appintf).setForm(this);
	}

	public async getFormsArea() : Promise<HTMLElement>
	{
        while(this.formarea == null)
        setTimeout(function() {}, 10);
        return(this.formarea.nativeElement);
	}
}