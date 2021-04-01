import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";
import { WindowOptions } from "../forms/WindowOptions";


export const wizard = () =>
{
    function define(form:any)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);
        let ctype:string = utils.getType(form);


        if (ctype != "Form")
        {
            console.log("@wizard can only be used on forms");
            return;
        }

        let wopt:WindowOptions = FormDefinitions.getWindowOpts(fname);
        wopt.wizard = true;
    }

    return(define);
}
