import { FieldInstance } from './input/FieldInstance';
import { NgModule } from '@angular/core';
import { MenuArea } from './menu/MenuArea';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { ModalWindow } from './forms/ModalWindow';
import { HttpClientModule } from '@angular/common/http';
import { LoginForm } from './database/LoginForm';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow, MenuArea, LoginForm, FieldInstance],
    exports     : [FormList, FormArea, MenuArea, FieldInstance],
    imports     : [CommonModule, HttpClientModule]
})


export class FormsLibrary
{
}