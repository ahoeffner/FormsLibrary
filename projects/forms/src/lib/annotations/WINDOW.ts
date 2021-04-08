import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";
import { WindowOptions } from "../forms/WindowOptions";


export const window = (inherit:boolean, width?:number|string, height?:number|string, top?:number|string, left?:number|string) =>
{
    function define(form:any)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);
        let ctype:string = utils.getType(form);


        if (ctype != "Form")
        {
            console.log("@window can only be used on forms");
            return;
        }


        if (top != null && top.constructor.name == "Number") top += "px";
        if (left != null && left.constructor.name == "Number") left += "px";
        if (width != null && width.constructor.name == "Number") width += "px";
        if (height != null && height.constructor.name == "Number") height += "px";

        let wopt:WindowOptions = FormDefinitions.getWindowOpts(fname);

        wopt.inherit = inherit;
        wopt.offsetTop = ""+top;
        wopt.width = ""+width;
        wopt.height = ""+height;
        wopt.offsetLeft = ""+left;
    }

    return(define);
}
