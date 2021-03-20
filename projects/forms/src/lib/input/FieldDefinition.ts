export interface FieldDefinition
{
    name:string;
    type:string;
    case?:string;
    mandatory?:boolean;
    column?:boolean|string;
}