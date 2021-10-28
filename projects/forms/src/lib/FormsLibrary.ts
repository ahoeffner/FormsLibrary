import { Wait } from './utils/Wait';
import { NgModule } from '@angular/core';
import { MenuArea } from './menu/MenuArea';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { LoginForm } from './database/LoginForm';
import { ModalWindow } from './forms/ModalWindow';
import { FieldInstance } from './input/FieldInstance';
import { HttpClientModule } from '@angular/common/http';
import { ListOfValuesImpl } from './listval/ListOfValuesImpl';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow, MenuArea, LoginForm, FieldInstance, ListOfValuesImpl, Wait],
    exports     : [FormList, FormArea, MenuArea, FieldInstance],
    imports     : [CommonModule, HttpClientModule]
})


export class FormsLibrary
{
}