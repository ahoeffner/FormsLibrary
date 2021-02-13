import { Utils } from '../utils/Utils';
import { ComponentRef } from '@angular/core';



export interface ModalOptions
{
    width?:number;
    height?:number;
    offsetTop?:number;
    offsetLeft?:number;
}


export interface FormsDefinition
{
    path?:string;
    title:string;
    component:any;
    navigable?:boolean;
    modal?:ModalOptions;
}


export interface Definition
{
    name:string;
    path:string;
    title:string;
    component:any;
    navigable?:boolean;
    options:ModalOptions;
    ref?:ComponentRef<any>;
}

export class Options
{
    private utils:Utils = new Utils();

    public complete(options:ModalOptions, create?:boolean) : ModalOptions
    {
        if (options == null)
        {
            if (create) options = {};
            else        return(null);
        }

        if (!options.hasOwnProperty("width")) options.width = 500;
        if (!options.hasOwnProperty("height")) options.height = 300;
        if (!options.hasOwnProperty("offsetTop")) options.offsetTop = 40;
        if (!options.hasOwnProperty("offsetLeft")) options.offsetLeft = 60;
        return(options);
    }


    public override(options:ModalOptions, base:ModalOptions) : ModalOptions
    {
        if (base == null) base = this.complete(base,true);
        if (!options.hasOwnProperty("width")) options.width = base.width;
        if (!options.hasOwnProperty("height")) options.height = base.height;
        if (!options.hasOwnProperty("offsetTop")) options.offsetTop = base.offsetTop;
        if (!options.hasOwnProperty("offsetLeft")) options.offsetLeft = base.offsetLeft;
        return(options);
    }


    public convert(form:FormsDefinition) : Definition
    {
        let fname:string = this.utils.getName(form.component);

        let navigable:boolean = true;

        form.modal = this.complete(form.modal);
        if (form.hasOwnProperty("navigable")) navigable = form.navigable;

        let path:string = "/"+fname;
        if (form.hasOwnProperty("path")) path = form.path;

        path = path.trim();
        if (!path.startsWith("/")) path = "/" + path;

        let def:Definition =
        {
            name: fname,
            path: form.path,
            options: form.modal,
            title: form.title,
            navigable: navigable,
            component: form.component,
        };

        return(def);
    }
}