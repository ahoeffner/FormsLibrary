import { Form } from './dynamic/Form';
import { NgModule } from '@angular/core';
import { Popup } from './dynamic/Popup';


@NgModule({
    declarations: [Form, Popup],
    exports     : [Form, Popup],

    imports     : [
      ]
  })


export class FormsLibrary
{
}