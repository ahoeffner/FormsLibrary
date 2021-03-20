import { Utils } from '../utils/Utils';
import { BlockDefinitions } from './BlockDefinitions';


export const alias = (alias:string) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@alias("+alias+") can only be used on blocks");
            return;
        }

        BlockDefinitions.setBlockDefaultAlias(cname,alias.toLowerCase());
    }
    return(def);
}