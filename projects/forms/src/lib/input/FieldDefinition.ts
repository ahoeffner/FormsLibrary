import { FieldType } from "./FieldType";
import { FieldOptions } from "./FieldOptions";


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
    default?:any;
    type?:FieldType;
    mandatory?:boolean;
    column?:boolean|string;
    fieldoptions?:FieldOptions;
}