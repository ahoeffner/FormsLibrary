import { WindowOptions } from './WindowOptions';
import { DatabaseUsage } from '../database/DatabaseUsage';


export interface FormDefinition
{
    path:string;
    title:string;
    component:any;
    navigable?:boolean;
    windowopts?:WindowOptions;
    databaseusage?:DatabaseUsage;
}
