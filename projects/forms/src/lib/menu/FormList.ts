import { Component } from '@angular/core';
import { Application } from '../application/Application';

@Component({
    selector: 'formlist',
    template: '<div [innerHtml]=page></div>',
    styleUrls: []
  })

export class FormList
{
	public page:string = "Hello World";

    constructor(app:Application)
    {
		this.page = "Hello II";
	}
}