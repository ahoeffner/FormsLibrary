import { FormImpl } from './FormImpl';
import { Utils } from '../utils/Utils';
import { ComponentRef } from '@angular/core';



export interface ModalOptions
{
    width?:string;
    height?:string;
    offsetTop?:string;
    offsetLeft?:string;
}


export interface FormDefinition
{
    path?:string;
    title:string;
    component:any;
    navigable?:boolean;
    modal?:ModalOptions;
}


export interface InstanceID
{
    name:string;
    impl:FormImpl;
    modalopts:ModalOptions;
    ref:ComponentRef<any>;
}


export interface FormInstance
{
    name:string;
    path:string;
    title:string;
    component:any;
    navigable?:boolean;
    modaldef:ModalOptions;
    modalopts:ModalOptions;
    ref?:ComponentRef<any>;
}

export class FormUtil
{
    private utils:Utils = new Utils();

    public complete(options:ModalOptions, create?:boolean) : ModalOptions
    {
        if (options == null)
        {
            if (create) options = {};
            else        return(null);
        }

        if (!options.hasOwnProperty("width")) options.width = "500px";
        if (!options.hasOwnProperty("height")) options.height = "300px";
        if (!options.hasOwnProperty("offsetTop")) options.offsetTop = "10vh";
        if (!options.hasOwnProperty("offsetLeft")) options.offsetLeft = "20vw";
        return(options);
    }


    public convert(form:FormDefinition) : FormInstance
    {
        let fname:string = this.utils.getName(form.component);

        let navigable:boolean = true;

        form.modal = this.complete(form.modal);
        if (form.hasOwnProperty("navigable")) navigable = form.navigable;

        let path:string = "/"+fname;
        if (form.hasOwnProperty("path")) path = form.path;

        path = path.trim();
        if (!path.startsWith("/")) path = "/" + path;

        let def:FormInstance =
        {
            name: fname,
            path: form.path,
            title: form.title,
            navigable: navigable,
            modaldef: form.modal,
            modalopts: form.modal,
            component: form.component,
        };

        return(def);
    }


    public clone(base:FormInstance) : FormInstance
    {
        let clone:FormInstance =
        {
            name: base.name,
            path: base.path,
            title: base.title,
            modaldef: base.modaldef,
            modalopts: base.modaldef,
            component: base.component,
            navigable: base.navigable
        }
        return(clone);
    }
}