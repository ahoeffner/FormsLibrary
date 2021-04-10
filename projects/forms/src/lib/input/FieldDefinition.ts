import { Case } from "../database/Case";
import { ListOfValuesFunction } from "../listval/ListOfValuesFunction";
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
    type?:FieldType;
    mandatory?:boolean;
    column?:boolean|string;
    fieldoptions?:FieldOptions;
}