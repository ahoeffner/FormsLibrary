import { Utils } from '../utils/Utils';
import { ColumnDefinitions } from './ColumnDefinitions';
import { ColumnDefinition } from '../database/ColumnDefinition';


export const column = (definition:ColumnDefinition) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@column("+definition.name+","+definition.type+") can only be used on blocks");
            return;
        }

        ColumnDefinitions.add(cname,definition);
        definition.name = definition.name.toLowerCase();
    }
    return(define);
}