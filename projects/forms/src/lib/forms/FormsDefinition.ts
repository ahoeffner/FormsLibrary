import { WindowOptions } from './WindowOptions';


export interface FormDefinition
{
    path?:string;
    title:string;
    component:any;
    navigable?:boolean;
    modal?:WindowOptions;
}
