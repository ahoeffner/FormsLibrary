import { Field } from './input/Field';
import { NgModule } from '@angular/core';
import { MenuArea } from './menu/MenuArea';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { ModalWindow } from './forms/ModalWindow';
import { HttpClientModule } from '@angular/common/http';
import { LoginForm } from './database/LoginForm';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow, MenuArea, LoginForm, Field],
    exports     : [FormList, FormArea, MenuArea, Field],
    imports     : [CommonModule, HttpClientModule]
})


export class FormsLibrary
{
}