import { Case } from "../input/FieldDefinition";

export interface ColumnDefinition
{
    case?:Case;
    name:string;
    type:string;
    mandatory?:boolean;
}