import { InstanceListener } from "./InstanceListener";

export class TriggerEvents
{
    keys:Map<string,InstanceListener[]> = new Map<string,InstanceListener[]>();
    types:Map<string,InstanceListener[]> = new Map<string,InstanceListener[]>();
    fields:Map<string,InstanceListener[]> = new Map<string,InstanceListener[]>();
}
