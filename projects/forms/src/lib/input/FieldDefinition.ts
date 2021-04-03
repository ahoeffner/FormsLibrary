import { FieldType } from "./FieldType";


export enum Case
{
    upper,
    lower,
    mixed
}

export interface FieldOptions
{
    query?:boolean;
    insert?:boolean;
    update?:boolean;
}

export interface FieldDefinition
{
    case?:Case;
    name:string;
    default?:any;
    type?:FieldType;
    mandatory?:boolean;
    column?:boolean|string;
    fieldoptions?:FieldOptions;
}