import { NgModule } from '@angular/core';
import { FormList } from './menu/FormList';
import { FormArea } from './forms/FormArea';
import { CommonModule } from "@angular/common";
import { ModalWindow } from './forms/ModalWindow';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [FormList, FormArea, ModalWindow],
    exports     : [FormList, FormArea],
    imports     : [CommonModule, HttpClientModule, MatIconModule, MatButtonModule]
})


export class FormsLibrary
{
}