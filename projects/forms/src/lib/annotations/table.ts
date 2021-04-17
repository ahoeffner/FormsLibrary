import { Utils } from '../utils/Utils';
import { TableDefinitions } from './TableDefinitions';
import { TableDefinition } from '../database/TableDefinition';

export const table = (definition:TableDefinition) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@table("+definition.name+") can only be used on blocks");
            return;
        }

        TableDefinitions.set(cname,definition);
    }
    return(define);
}