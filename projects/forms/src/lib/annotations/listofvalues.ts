import { Utils } from "../utils/Utils";
import { LOVDefinitions } from "./LOVDefinitions";

export const listofvalues = (field:string) =>
{
    function define(comp:any, func?:string)
    {
        let utils:Utils = new Utils();
        let ctype:string = utils.getType(comp);
        let params:string[] = utils.getParams(comp[func]);

        let block:boolean = false;
        if (ctype == "Block") block = true;

        LOVDefinitions.add(block,field,comp,func,params);
    }

    return(define);
}
