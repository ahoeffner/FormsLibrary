import { Utils } from '../utils/Utils';
import { TableDefinitions } from './TableDefinitions';
import { TableDefinition } from '../database/TableDefinition';

export const table = (name:string) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@table("+name+") can only be used on blocks");
            return;
        }

        let definition:TableDefinition = {name: name};
        TableDefinitions.set(cname,definition);
    }
    return(define);
}