import { DatabaseUsage } from '../database/DatabaseUsage';

export interface BlockDefinition
{
    prop:string;
    alias:string;
    component:any;
    databaseopts?:DatabaseUsage;
}