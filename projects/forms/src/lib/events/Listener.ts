import { Trigger } from "./Triggers";
import { TriggerFunction } from "./TriggerFunction";

export interface Listener
{
    inst:any;
    type?: Trigger;
    field?: string;
    func:TriggerFunction;
}
