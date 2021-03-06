import { Utils } from '../utils/Utils';
import { BlockDefinition } from './BlockDefinition';
import { BlockDefinitions } from './BlockDefinitions';


export const BLOCK = (alias:string, component?:any) =>
{
    function def(form:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);

        let def:BlockDefinition =
        {
            prop:prop,
            alias: alias,
            component: component
        }

        BlockDefinitions.setBlock(fname,def);
    }
    return(def);
}