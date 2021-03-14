import { InstanceListener } from "./InstanceListener";

export class InstanceEvents
{
    keys:Map<string,InstanceListener[]> = new Map<string,InstanceListener[]>();
    types:Map<string,InstanceListener[]> = new Map<string,InstanceListener[]>();
}
