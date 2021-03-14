import { FieldInstance } from "../input/FieldInstance";

export interface EventListener
{
    onEvent(event:any, field:FieldInstance, type:string, key?:string) : void;
}