import { NgModule } from '@angular/core';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { ModalWindow } from './forms/ModalWindow';
import { DropDownMenu } from './menu/DropDownMenu';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow, DropDownMenu],
    exports     : [FormList, FormArea, DropDownMenu],
    imports     : [CommonModule, HttpClientModule]
})


export class FormsLibrary
{
}