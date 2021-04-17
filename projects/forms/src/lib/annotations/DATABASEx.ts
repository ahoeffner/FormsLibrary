import { Utils } from "../utils/Utils";
import { DatabaseUsage } from "../database/DatabaseUsage";
import { DatabaseDefinitions } from "./DatabaseDefinitions";

export const database = (usage:DatabaseUsage) =>
{
    function define(component:any)
    {
        let utils:Utils = new Utils();
        let comp:string = utils.getName(component);
        let type:string = utils.getType(component);

        if (type == "Form")
        {
            DatabaseDefinitions.setFormUsage(comp,usage);
            return;
        }

        if (type == "Block")
        {
            DatabaseDefinitions.setBlockDefault(comp,usage);
            return;
        }

        console.log("@database can only be used in conjunction with Form or Block");
    }
    return(define);
}