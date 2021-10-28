import { FormImpl } from "./FormImpl";
import { ComponentRef } from "@angular/core";
import { WindowOptions } from "./WindowOptions";

export interface InstanceID
{
    name:string;
    impl:FormImpl;
    modalopts:WindowOptions;
    ref:ComponentRef<any>;
}
