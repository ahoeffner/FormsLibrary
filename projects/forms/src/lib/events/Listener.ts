import { TriggerEvent } from "./TriggerEvent";

export interface Listener
{
    (event:TriggerEvent) : Promise<boolean>;
}