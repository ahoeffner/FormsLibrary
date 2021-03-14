import { Utils } from '../utils/Utils';
import { BlockDefinitions } from './BlockDefinitions';
import { DatabaseUsage } from '../database/DatabaseUsage';
import { BlockDefinition } from '../blocks/BlockDefinition';


export const BLOCK = (alias?:string, component?:any, usage?:DatabaseUsage) =>
{
    function def(comp:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(comp);
        let type:string = utils.getType(comp);
        if (alias != null) alias = alias.toLowerCase();

        if (type == "Block" || type == "ControlBlock")
        {
            BlockDefinitions.setBlockDefaultAlias(name,alias);
            return;
        }

        let def:BlockDefinition =
        {
            prop: prop,
            alias: alias,
            component: component,
            databaseopts: usage
        }

        BlockDefinitions.setBlock(name,def);
    }
    return(def);
}