import { FieldInstance } from "../input/FieldInstance";

export interface Listener
{
    (field:FieldInstance, type:string, key?:string) : void;
}