import { Utils } from "../utils/Utils";
import { Trigger } from "../events/Triggers";
import { TriggerDefinition, TriggerDefinitions } from "./TriggerDefinitions";

export const validate = (field:string|string[]) =>
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
            console.log("@validate can only be applied on Block or Form");
            return;
        }

        let block:boolean = false;
        if (ctype == "Block") block = true;

        let fields:string[] = [];
        if (field.constructor.name == "Array") fields = field as string[];
        else                                   fields.push(field as string);

        fields.forEach((fld)=>
        {
            let trg:TriggerDefinition =
            {
                inst: comp,
                field: fld,
                params: params,
                func: comp[func],
                trigger: Trigger.WhenValidateField
            }

            TriggerDefinitions.add(block,cname,trg);
        });
    }

    return(define);
}
