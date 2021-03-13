import { FieldInstance } from "../input/FieldInstance";

export interface Listener
{
    (event:any, field:FieldInstance, type:string, key?:string) : void;
}