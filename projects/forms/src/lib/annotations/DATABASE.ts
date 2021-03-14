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

        if (type == "Form" && prop == null)
        {
            DatabaseDefinitions.setFormUsage(comp,usage);
            return;
        }

        if (type == "Block" && prop == null)
        {
            DatabaseDefinitions.setBlockDefault(comp,usage);
            return;
        }

        if (prop == null)
        {
            window.alert("@DATABASE can only be used in conjunction with Form or Block");
            return;
        }

        DatabaseDefinitions.setBlockUsage(comp,prop,usage);
    }
    return(def);
}