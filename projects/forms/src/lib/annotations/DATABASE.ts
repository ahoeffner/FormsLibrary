import { Utils } from "../utils/Utils";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { DatabaseDefinitions } from "./DatabaseDefinitions";

export const DATABASE = (usage:DatabaseUsage) =>
{
    function def(component:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let comp:string = utils.getName(component);
        let type:string = utils.getType(component);

        DatabaseDefinitions.setUsage(comp,type,prop,usage);
    }
    return(def);
}