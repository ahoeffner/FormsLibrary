import { TriggerEvent } from "./TriggerEvent";

export interface TriggerFunction
{
    (event:TriggerEvent) : Promise<boolean>;
}