import { Utils } from '../utils/Utils';
import { BlockDefinition } from './BlockDefinition';
import { BlockDefinitions } from './BlockDefinitions';
import { BlockDefinition as BlockDef } from '../blocks/BlockDefinition';


export const block = (definition:BlockDefinition) =>
{
    function define(comp:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let name:string = utils.getName(comp);
        let type:string = utils.getType(comp);

        if (type != "Form")
        {
            console.log("@block can only be used with forms");
            return;
        }

        if (definition.alias != null)
            definition.alias = definition.alias.toLowerCase();

        let def:BlockDef =
        {
            prop: prop,
            alias: definition.alias,
            component: definition.component,
            databaseopts: definition.databaseopts
        }

        BlockDefinitions.setBlock(name,def);
    }
    return(define);
}