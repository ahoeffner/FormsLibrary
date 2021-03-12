import { FieldInstance } from "../input/FieldInstance";

export interface Listener
{
    keys?:string|string[];
    types?:string|string[];
    listener(field:FieldInstance, type:string, key?:string) : void;
}