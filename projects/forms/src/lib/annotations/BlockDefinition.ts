import { DatabaseUsage } from '../database/DatabaseUsage';

export interface BlockDefinition
{
    alias:string;
    component:any;
    databaseopts?:DatabaseUsage;
}