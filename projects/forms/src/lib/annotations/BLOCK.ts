import { Utils } from '../utils/Utils';
import { BlockDefinitions } from './BlockDefinitions';
import { BlockDefinition } from '../blocks/BlockDefinition';


export const BLOCK = (alias?:string, component?:any) =>
{
    function def(comp:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(comp);
        let type:string = utils.getType(comp);

        if (type == "Block")
        {
            BlockDefinitions.setBlockDefaultAlias(name,alias);
            return;
        }

        let def:BlockDefinition =
        {
            prop: prop,
            alias: alias,
            component: component
        }

        BlockDefinitions.setBlock(name,def);
    }
    return(def);
}