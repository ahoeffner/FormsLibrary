import { FormArea } from './forms/FormArea';
import { NgModule } from '@angular/core';
import { PopupWindow } from './popup/PopupWindow';


@NgModule({
    declarations: [FormArea, PopupWindow],
    exports     : [FormArea],

    imports     : [
      ]
  })


export class FormsLibrary
{
}