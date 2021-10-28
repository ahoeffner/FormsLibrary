import { Case } from "./Case";
import { Column } from "./Column";

export interface ColumnDefinition
{
    case?:Case;
    name:string;
    type:Column;
    default?:any;
    mandatory?:boolean;
}