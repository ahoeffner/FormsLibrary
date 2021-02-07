import { Form } from "./dynamic/Form";
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
  })

export class Application
{
    private title$:string;
    private form$:Form = null;


    public get form() : Form
    {
        return(this.form$);
    }

    public set form(form:Form)
    {
        this.form$ = form;
    }

    public get title() : string
    {
        return(this.title$);
    }

    public set title(title:string)
    {
        this.title$ = title;
        document.title = this.title$;
    }
}