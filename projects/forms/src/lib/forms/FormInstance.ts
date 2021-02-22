import { Form } from "./Form";
import { ComponentRef } from "@angular/core";
import { WindowOptions } from "./WindowOptions";


export interface FormInstance
{
    name:string;
    path:string;
    title:string;
    component:any;
    navigable?:boolean;
    windowdef:WindowOptions;
    windowopts?:WindowOptions;
    formref?:ComponentRef<Form>;
}