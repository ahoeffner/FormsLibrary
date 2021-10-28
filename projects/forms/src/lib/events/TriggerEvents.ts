import { Listener } from "./Listener";

export class TriggerEvents
{
    types:Map<string,Listener[]> = new Map<string,Listener[]>();
    fields:Map<string,Map<string,Listener[]>> = new Map<string,Map<string,Listener[]>>();
}
