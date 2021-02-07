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


  public newform(form:any, title?:string, url?:string) : void
  {
    this.display(form,url,title,true);
  }


  public callform(form:any, title?:string, url?:string) : void
  {
    this.display(form,url,title,false);
  }


  private display(form:any, url:string, title:string, destroy:boolean) : void
  {
    if (this.page != null) this.page.dismiss(destroy);
    this.page = this.builder.createComponent(form);

    let state = {additionalInformation: 'None'};
    window.history.replaceState(state,title,this.url+"/"+url);

    this.page.display();
  }
}