import { Utils } from "../utils/Utils";
import { WindowOptions } from "../forms/WindowOptions";
import { FormDefinitions } from "./FormDefinitions";


export const WINDOW = (inherit:boolean, top?:number|string, left?:number|string, width?:number|string, height?:number|string) =>
{
    function def(form:any)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);

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

    return(def);
}
