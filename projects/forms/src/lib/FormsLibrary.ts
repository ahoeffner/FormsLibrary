import { NgModule } from '@angular/core';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { PopupWindow } from './popup/PopupWindow';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [FormList, FormArea, PopupWindow],
    exports     : [FormList, FormArea],
    imports     : [CommonModule, MatIconModule, MatButtonModule]
})


export class FormsLibrary
{
}