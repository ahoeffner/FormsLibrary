import { Utils } from '../utils/Utils';
import { TableDefinitions } from './TableDefinitions';

export const table = (table:string) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            window.alert("@table("+table+") can only be used on blocks");
            return;
        }

        console.log("setting table "+table+" for "+cname);
        TableDefinitions.set(cname,table);
    }
    return(def);
}