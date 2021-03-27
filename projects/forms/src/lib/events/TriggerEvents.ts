import { Listener } from "./Listener";

export class TriggerEvents
{
    keys:Map<string,Listener[]> = new Map<string,Listener[]>();
    types:Map<string,Listener[]> = new Map<string,Listener[]>();
    fields:Map<string,Listener[]> = new Map<string,Listener[]>();
}
