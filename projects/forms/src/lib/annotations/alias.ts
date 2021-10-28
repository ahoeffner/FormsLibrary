import { Utils } from '../utils/Utils';
import { BlockDefinitions } from './BlockDefinitions';


export const alias = (alias:string) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@alias("+alias+") can only be used on blocks");
            return;
        }

        if (alias == null)
        {
            console.log("@alias("+alias+") cannot be null");
            return;
        }

        BlockDefinitions.setDefaultAlias(cname,alias.toLowerCase());
    }
    return(define);
}