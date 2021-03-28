import { FieldType } from "./FieldType";

export enum Case
{
    upper,
    lower,
    mixed
}

export interface FieldDefinition
{
    case?:Case;
    name:string;
    type?:FieldType;
    mandatory?:boolean;
    column?:boolean|string;
}