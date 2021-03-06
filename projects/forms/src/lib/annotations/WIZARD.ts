import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";
import { WindowOptions } from "../forms/WindowOptions";


export const WIZARD = () =>
{
    function def(form:any)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);
        let wopt:WindowOptions = FormDefinitions.getWindowOpts(fname);
        wopt.wizard = true;
    }

    return(def);
}
