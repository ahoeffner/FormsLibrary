import { ListOfValues } from "./ListOfValues";

export interface ListOfValuesFunction
{
    (field:string, id:string, record:number) : ListOfValues
}