import { Utils } from '../utils/Utils';
import { TableDefinitions } from './TableDefinitions';
import { TableDefinition } from '../database/TableDefinition';

export const orderby = (order:string) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@orderby can only be used on blocks");
            return;
        }

        let definition:TableDefinition = {order: order};
        TableDefinitions.set(cname,definition);
    }
    return(define);
}