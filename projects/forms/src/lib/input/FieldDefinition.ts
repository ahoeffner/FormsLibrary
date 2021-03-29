import { FieldType } from "./FieldType";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { FieldOption, FieldOptions } from "./FieldOptions";


export enum Case
{
    upper,
    lower,
    mixed
}

export interface FieldDefinition
{
    id?:string;
    case?:Case;
    name:string;
    type?:FieldType;
    mandatory?:boolean;
    column?:boolean|string;
    fieldoptions?:FieldOptions;
}