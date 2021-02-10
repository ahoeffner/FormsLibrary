import { NgModule } from '@angular/core';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { PopupWindow } from './popup/PopupWindow';


@NgModule({
    declarations: [FormList, FormArea, PopupWindow],
    exports     : [FormList, FormArea],

    imports     : [CommonModule]
})


export class FormsLibrary
{
}