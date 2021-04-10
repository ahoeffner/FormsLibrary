import { Utils } from "../utils/Utils";
import { LOVDefinitions } from "./LOVDefinitions";

export const listofvalues = (field:string) =>
{
    function define(comp:any, func?:string)
    {
        let utils:Utils = new Utils();
        let params:string[] = utils.getParams(comp[func]);

        LOVDefinitions.add(field,comp,func,params);
    }

    return(define);
}
