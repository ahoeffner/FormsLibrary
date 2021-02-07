import { Page } from './Page';
import { Builder } from './Builder';
import { Component } from '@angular/core';
import { Application } from '../Application';


@Component({
  selector: 'form',
  template: '',
  styleUrls: []
})


export class Form
{
  private url:string;
  private page:Page = null;


  constructor(app:Application, private builder:Builder)
  {
    app.form = this;
    this.url = window.location.protocol + '//' + window.location.host;
  }


  public newform(form:any) : void
  {
    this.display(form,true);
  }


  public callform(form:any) : void
  {
    this.display(form,false);
  }


  private display(form:any, destroy:boolean) : void
  {
    if (this.page != null) this.page.dismiss(destroy);
    this.page = this.builder.createComponent(form);

    let state = {additionalInformation: 'None'};
    window.history.replaceState(state,this.page.name(),this.url+"/"+this.page.url());

    this.page.display();
  }
}