import { Case } from "../database/Case";
import { FieldType } from "./FieldType";

export interface FieldOptions
{
    query?:boolean;
    insert?:boolean;
    update?:boolean;
    navigable?:boolean;
}

export interface FieldDefinition
{
    case?:Case;
    name:string;
    default?:any;
    column?:string;
    type?:FieldType;
    mandatory?:boolean;
    fieldoptions?:FieldOptions;
}