import { Utils } from '../utils/Utils';
import { BlockDefinition } from './BlockDefinition';
import { BlockDefinitions } from './BlockDefinitions';
import { BlockDefinition as BlockDef } from '../blocks/BlockDefinition';


export const block = (definition:BlockDefinition) =>
{
    function def(comp:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(comp);
        let type:string = utils.getType(comp);

        if (type != "Form")
        {
            console.log("@block can only be used with forms");
            return;
        }

        let def:BlockDef =
        {
            prop: prop,
            alias: definition.alias,
            component: definition.component,
            databaseopts: definition.databaseopts
        }

        BlockDefinitions.setBlock(name,def);
    }
    return(def);
}