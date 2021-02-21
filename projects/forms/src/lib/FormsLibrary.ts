import { NgModule } from '@angular/core';
import { MenuArea } from './menu/MenuArea';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { ModalWindow } from './forms/ModalWindow';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow, MenuArea],
    exports     : [FormList, FormArea, MenuArea],
    imports     : [CommonModule, HttpClientModule]
})


export class FormsLibrary
{
}