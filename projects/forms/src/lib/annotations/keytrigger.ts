import { Utils } from "../utils/Utils";
import { keymap } from "../keymap/KeyMap";
import { Trigger } from "../events/Triggers";
import { TriggerDefinition, TriggerDefinitions } from "./TriggerDefinitions";


export const keytrigger = (key:keymap|keymap[]) =>
{
    function define(comp:any, func?:string)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);
        let params:string[] = utils.getParams(comp[func]);

        if (params.length != 1)
        {
            console.log("function "+func+" must take 1 TriggerEvent argument");
            return;
        }

        if (ctype != "Block" && ctype != "Form")
        {
            console.log("@keytrigger can only be applied on Block or Form");
            return;
        }

        let block:boolean = false;
        if (ctype == "Block") block = true;

        let keys:keymap[] = [];

        if (key.constructor.name == "Array") keys = key as keymap[];
        else                                 keys.push(key as keymap);

        keys.forEach((key) =>
        {
            let trg:TriggerDefinition =
            {
                key: key,
                block: block,
                params: params,
                func: comp[func],
                trigger: Trigger.Key
            }

            TriggerDefinitions.add(block,cname,trg);
        });
    }

    return(define);
}
