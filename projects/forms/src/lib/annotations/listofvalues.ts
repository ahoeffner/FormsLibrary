import { Utils } from "../utils/Utils";
import { LOVDefinitions } from "./LOVDefinitions";

export const listofvalues = (field:string|string[]) =>
{
    function define(comp:any, func?:string)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);
        let params:string[] = utils.getParams(comp[func]);

        if (ctype != "Block" && ctype != "Form")
        {
            console.log("@listofvalues can only be applied on Block or Form");
            return;
        }

        let block:boolean = false;
        if (ctype == "Block") block = true;

        let fields:string[] = [];
        if (field.constructor.name == "Array") fields = field as string[];
        else                                   fields.push(field as string);

        fields.forEach((fld) => {LOVDefinitions.add(block,cname,fld,comp,func,params)});
    }

    return(define);
}
